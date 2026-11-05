import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { logSecurityEvent, getClientIdentifier } from '@/lib/security';

export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedUser(req);
  if (auth) {
    await logSecurityEvent({
      action: 'USER_LOGOUT',
      userId: auth.user.id,
      metadata: { email: auth.user.email },
      ipAddress: getClientIdentifier(req),
    });
  }

  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  
  response.cookies.set('foodloop_session', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
  });

  response.cookies.set('foodloop_user_id', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
