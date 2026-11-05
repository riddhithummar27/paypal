import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  verifyPassword,
  hashPassword,
  createSessionToken,
  isValidEmail,
  sanitizeString,
  logSecurityEvent,
  getClientIdentifier,
} from '@/lib/security';
import { enforceRateLimit } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  // 1. Sliding-window rate limiting on auth endpoints (15 req/min per IP)
  const rateLimitError = enforceRateLimit(req, 'auth', 15, 60);
  if (rateLimitError) return rateLimitError;

  const ip = getClientIdentifier(req);

  try {
    const body = await req.json();
    const email = sanitizeString(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      await logSecurityEvent({
        action: 'FAILED_LOGIN_UNKNOWN_EMAIL',
        metadata: { email },
        ipAddress: ip,
      });
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 2. Cryptographic password verification
    const isPasswordValid = verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      await logSecurityEvent({
        action: 'FAILED_LOGIN_BAD_PASSWORD',
        userId: user.id,
        metadata: { email: user.email },
        ipAddress: ip,
      });
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 3. Transparently upgrade legacy plain-text password to scrypt hash
    if (user.passwordHash && !user.passwordHash.startsWith('scrypt:')) {
      const secureHash = hashPassword(password);
      await db.users.update(user.id, { passwordHash: secureHash });
    }

    // 4. Create cryptographically signed HMAC session token
    const sessionToken = createSessionToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    // 5. Audit log
    await db.auditLogs.create({
      user_id: user.id,
      action: 'USER_LOGIN',
      entity_type: 'profile',
      entity_id: user.id,
      metadata: { role: user.role, email: user.email },
      ip_address: ip,
    });

    const safeUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
      organization_name: user.organization_name,
      address: user.address,
      phone: user.phone,
      is_verified: user.is_verified,
    };

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token: sessionToken,
    });

    // Secure HTTP-Only signed session cookie
    response.cookies.set('foodloop_session', sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 86400,
    });

    // Client-accessible user ID cookie for existing component sync
    response.cookies.set('foodloop_user_id', user.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 30 * 86400,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
