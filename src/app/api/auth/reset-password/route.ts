import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  hashPassword,
  isValidEmail,
  sanitizeString,
  logSecurityEvent,
  getClientIdentifier,
} from '@/lib/security';
import { enforceRateLimit } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  // Rate limiting on password resets
  const rateLimitError = enforceRateLimit(req, 'auth', 10, 60);
  if (rateLimitError) return rateLimitError;

  const ip = getClientIdentifier(req);

  try {
    const { email: rawEmail, newPassword } = await req.json();
    const email = sanitizeString(rawEmail).toLowerCase();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters long for security compliance.' },
        { status: 400 }
      );
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const secureHash = hashPassword(newPassword);
    await db.users.update(user.id, { passwordHash: secureHash });

    await logSecurityEvent({
      action: 'PASSWORD_RESET_COMPLETED',
      userId: user.id,
      metadata: { email: user.email },
      ipAddress: ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully updated. You may now log in with your new credentials.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
