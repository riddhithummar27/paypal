import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword, resetToken } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await db.users.update(user.id, { passwordHash: newPassword });

    await db.auditLogs.create({
      user_id: user.id,
      action: 'PASSWORD_RESET_COMPLETED',
      entity_type: 'profile',
      entity_id: user.id,
      metadata: { email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully updated. You may now log in with your new credentials.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
