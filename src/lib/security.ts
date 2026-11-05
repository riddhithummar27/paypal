/**
 * FOODLOOP Security Layer
 * - Cryptographic password hashing & verification with scrypt + timing-safe comparison
 * - Cryptographically signed HMAC-SHA256 session tokens (tamper-proof)
 * - Sliding-window in-memory rate limiting with retry-after calculation
 * - Strict input sanitization and XSS prevention
 * - Security audit logging
 */

import crypto from 'node:crypto';
import { db } from './db';

const SECRET_KEY =
  process.env.SESSION_SECRET ||
  process.env.PAYPAL_CLIENT_SECRET ||
  'foodloop-secure-zero-waste-token-secret-salt-2026';

// ============================================================================
// 1. Password Hashing & Verification (scrypt + timingSafeEqual)
// ============================================================================

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, storedHashOrPassword?: string): boolean {
  if (!storedHashOrPassword) return false;

  // Check if password was hashed with scrypt
  if (storedHashOrPassword.startsWith('scrypt:')) {
    const parts = storedHashOrPassword.split(':');
    if (parts.length !== 3) return false;
    const [, salt, expectedHashHex] = parts;
    try {
      const derivedKey = crypto.scryptSync(password, salt, 64);
      const expectedBuffer = Buffer.from(expectedHashHex, 'hex');
      if (derivedKey.length !== expectedBuffer.length) return false;
      return crypto.timingSafeEqual(derivedKey, expectedBuffer);
    } catch {
      return false;
    }
  }

  // Fallback for baseline seeded accounts (e.g. 'donor123', 'admin123')
  // Use constant-time comparison to prevent timing leaks
  const a = Buffer.from(password);
  const b = Buffer.from(storedHashOrPassword);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ============================================================================
// 2. Cryptographic HMAC-SHA256 Session Tokens
// ============================================================================

export interface SessionPayload {
  userId: string;
  role: 'donor' | 'recipient' | 'ngo' | 'admin';
  email: string;
  exp: number; // epoch ms
}

export function createSessionToken(payload: Omit<SessionPayload, 'exp'> & { expiresInMs?: number }): string {
  const exp = Date.now() + (payload.expiresInMs || 30 * 24 * 60 * 60 * 1000); // 30 days default
  const fullPayload: SessionPayload = {
    userId: payload.userId,
    role: payload.role,
    email: payload.email,
    exp,
  };

  const payloadB64 = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payloadB64).digest('base64url');

  return `${payloadB64}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;
  try {
    const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(payloadB64).digest('base64url');
    const sigA = Buffer.from(signature);
    const sigB = Buffer.from(expectedSig);

    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadB64, 'base64url').toString('utf8');
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.exp) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

// ============================================================================
// 3. Sliding-Window In-Memory Rate Limiting
// ============================================================================

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic garbage collection every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < 300000);
      if (entry.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    }
  }, 300000);
}

export function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowSeconds: number = 60
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
} {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const cutoff = now - windowMs;

  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    rateLimitStore.set(key, entry);
  }

  // Filter out expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldestInWindow + windowMs - now) / 1000));
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetInSeconds,
    };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - entry.timestamps.length,
    resetInSeconds: windowSeconds,
  };
}

// Helper to extract client IP or fallback identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

// ============================================================================
// 4. Input Sanitization & Validation
// ============================================================================

export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, (match) => (match === '<' ? '&lt;' : '&gt;'))
    .trim();
}

export function isValidEmail(email: unknown): boolean {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function sanitizeNumber(value: unknown, min = 0, max = 1000000, fallback = 0): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

// ============================================================================
// 5. Security Audit Logging
// ============================================================================

export async function logSecurityEvent({
  action,
  userId,
  metadata,
  ipAddress,
}: {
  action: string;
  userId?: string;
  metadata?: any;
  ipAddress?: string;
}) {
  try {
    await db.auditLogs.create({
      user_id: userId,
      action: `SEC_${action}`,
      entity_type: 'security_event',
      entity_id: userId || 'anonymous',
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
      ip_address: ipAddress || 'internal',
    });
  } catch (err) {
    console.warn('Failed to persist security audit log:', err);
  }
}
