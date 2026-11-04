import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get('foodloop_user_id')?.value;
    const body = await req.json();
    const targetUserId = body.userId || userId;

    if (!targetUserId) {
      return NextResponse.json({ error: 'User ID is required to update profile.' }, { status: 401 });
    }

    const updated = await db.users.update(targetUserId, {
      full_name: body.full_name,
      phone: body.phone,
      organization_name: body.organization_name,
      address: body.address,
      city: body.city,
      state: body.state,
      lat: body.lat,
      lng: body.lng,
      avatar_url: body.avatar_url,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    await db.auditLogs.create({
      user_id: targetUserId,
      action: 'PROFILE_UPDATED',
      entity_type: 'profile',
      entity_id: targetUserId,
      metadata: { fields: Object.keys(body) },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
