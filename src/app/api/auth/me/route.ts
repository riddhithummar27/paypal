import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('foodloop_user_id')?.value;
    if (!userId) {
      // Default to initial donor session for smooth browsing if not logged in
      const defaultUser = await db.users.findById('usr-donor-01');
      return NextResponse.json({ authenticated: false, user: defaultUser });
    }

    const user = await db.users.findById(userId);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
