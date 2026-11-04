import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Verify password
    if (user.passwordHash && user.passwordHash !== password) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Audit log
    await db.auditLogs.create({
      user_id: user.id,
      action: 'USER_LOGIN',
      entity_type: 'profile',
      entity_id: user.id,
      metadata: { role: user.role, email: user.email },
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
    });

    response.cookies.set('foodloop_user_id', user.id, {
      path: '/',
      httpOnly: false,
      maxAge: 30 * 86400,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
