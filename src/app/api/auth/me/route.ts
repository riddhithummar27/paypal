import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { createSessionToken } from '@/lib/security';

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);

    if (!auth) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const { user, session } = auth;

    const response = NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
        organization_name: user.organization_name,
        address: user.address,
        phone: user.phone,
        is_verified: user.is_verified,
      },
    });

    // If session cookie is missing but legacy cookie was authenticated, upgrade with signed session cookie
    if (!req.cookies.get('foodloop_session')?.value) {
      const refreshedToken = createSessionToken({
        userId: user.id,
        role: user.role,
        email: user.email,
      });

      response.cookies.set('foodloop_session', refreshedToken, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 86400,
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
