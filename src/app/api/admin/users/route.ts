import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const users = await db.users.list();
    return NextResponse.json({
      success: true,
      count: users.length,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        organization_name: u.organization_name,
        address: u.address,
        city: u.city,
        state: u.state,
        phone: u.phone,
        avatar_url: u.avatar_url,
        is_verified: u.is_verified,
        created_at: u.created_at,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list users.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, role, is_verified } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (typeof is_verified === 'boolean') updates.is_verified = is_verified;

    const updated = await db.users.update(userId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    await db.auditLogs.create({
      action: 'ADMIN_USER_UPDATED',
      entity_type: 'profile',
      entity_id: userId,
      metadata: updates,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update user.' }, { status: 500 });
  }
}
