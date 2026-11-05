/**
 * FOODLOOP Authentication & RBAC Guard Helper
 * Validates cryptographically signed sessions and enforces Role-Based Access Control.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, UserProfile } from './db';
import {
  verifySessionToken,
  SessionPayload,
  checkRateLimit,
  getClientIdentifier,
  logSecurityEvent,
} from './security';

export interface AuthContext {
  user: UserProfile;
  session: SessionPayload;
}

export async function getAuthenticatedUser(req: NextRequest): Promise<AuthContext | null> {
  // 1. Try cryptographically signed session cookie first
  const sessionCookie = req.cookies.get('foodloop_session')?.value;
  const authHeader = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  const token = sessionCookie || authHeader;

  if (token) {
    const payload = verifySessionToken(token);
    if (payload) {
      const user = await db.users.findById(payload.userId);
      if (user) {
        return { user, session: payload };
      }
    }
  }

  // 2. Transitional fallback for existing cookie sessions (e.g. foodloop_user_id)
  const legacyUserId = req.cookies.get('foodloop_user_id')?.value;
  if (legacyUserId) {
    const user = await db.users.findById(legacyUserId);
    if (user) {
      const syntheticSession: SessionPayload = {
        userId: user.id,
        role: user.role,
        email: user.email,
        exp: Date.now() + 86400000,
      };
      return { user, session: syntheticSession };
    }
  }

  return null;
}

export async function requireAuth(
  req: NextRequest,
  options: {
    allowedRoles?: Array<'donor' | 'recipient' | 'ngo' | 'admin'>;
    actionName?: string;
  } = {}
): Promise<{ auth: AuthContext } | { response: NextResponse }> {
  const auth = await getAuthenticatedUser(req);

  if (!auth) {
    const ip = getClientIdentifier(req);
    await logSecurityEvent({
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      metadata: { path: req.nextUrl.pathname, action: options.actionName },
      ipAddress: ip,
    });

    return {
      response: NextResponse.json(
        {
          error: 'Authentication required. Please sign in to access this resource.',
          code: 'UNAUTHORIZED',
        },
        { status: 401 }
      ),
    };
  }

  if (options.allowedRoles && options.allowedRoles.length > 0) {
    if (!options.allowedRoles.includes(auth.user.role)) {
      const ip = getClientIdentifier(req);
      await logSecurityEvent({
        action: 'FORBIDDEN_ROLE_ATTEMPT',
        userId: auth.user.id,
        metadata: {
          userRole: auth.user.role,
          requiredRoles: options.allowedRoles,
          path: req.nextUrl.pathname,
        },
        ipAddress: ip,
      });

      return {
        response: NextResponse.json(
          {
            error: `Access denied. Requires one of the following roles: [${options.allowedRoles.join(', ')}]. Current role: '${auth.user.role}'.`,
            code: 'FORBIDDEN',
          },
          { status: 403 }
        ),
      };
    }
  }

  return { auth };
}

export function enforceRateLimit(
  req: NextRequest,
  category: 'auth' | 'paypal' | 'api' = 'api',
  customLimit?: number,
  customWindowSec?: number
): NextResponse | null {
  const ip = getClientIdentifier(req);
  const key = `${category}:${ip}`;

  // Rate limits per category
  const limits = {
    auth: { max: 15, window: 60 }, // 15 auth attempts per minute
    paypal: { max: 30, window: 60 }, // 30 checkout/payment requests per minute
    api: { max: 120, window: 60 }, // 120 generic API calls per minute
  };

  const config = limits[category];
  const max = customLimit || config.max;
  const windowSec = customWindowSec || config.window;

  const result = checkRateLimit(key, max, windowSec);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests. Please slow down.',
        retryAfter: result.resetInSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': result.resetInSeconds.toString(),
          'X-RateLimit-Limit': max.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetInSeconds.toString(),
        },
      }
    );
  }

  return null;
}
