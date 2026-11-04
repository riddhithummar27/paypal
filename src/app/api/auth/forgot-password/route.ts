import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      // Don't reveal account existence for security
      return NextResponse.json({
        success: true,
        message: 'If an account with this email exists, password reset instructions have been sent.',
      });
    }

    // Generate mock reset token
    const resetToken = `RST-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    await db.auditLogs.create({
      user_id: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      entity_type: 'profile',
      entity_id: user.id,
      metadata: { email: user.email },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset instructions have been dispatched. Use your reset token or link to set a new password.',
      resetToken, // Returned for easy local dev / testing
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
