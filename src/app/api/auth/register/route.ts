import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, role, organization_name, phone, address, city, state } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Email, password, and full name are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Role-Based Restriction: Admin accounts must be securely provisioned, never freely selectable in public registration
    const requestedRole = (role || 'recipient').toLowerCase();
    if (requestedRole === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts cannot be registered via public signup. Contact system administrator.' },
        { status: 403 }
      );
    }

    const validRoles = ['donor', 'recipient', 'ngo'];
    if (!validRoles.includes(requestedRole)) {
      return NextResponse.json({ error: 'Invalid registration role.' }, { status: 400 });
    }

    const existing = await db.users.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const newUser = await db.users.create({
      email,
      passwordHash: password, // In production, bcrypt hash is used
      full_name,
      role: requestedRole as 'donor' | 'recipient' | 'ngo',
      organization_name,
      phone,
      address,
      city,
      state,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(full_name)}`,
      is_verified: requestedRole === 'ngo' ? false : true,
    });

    // If NGO, create corresponding NGO profile
    if (requestedRole === 'ngo') {
      await db.ngos.create({
        profile_id: newUser.id,
        name: organization_name || full_name,
        registration_number: body.registration_number || 'REG-PENDING',
        tax_id: body.tax_id || 'TAX-PENDING',
        mission_statement: body.mission_statement || 'Community food rescue and distribution.',
        capacity_portions_per_day: 500,
        cooling_capacity_liters: 250,
        fleet_vehicles: 2,
        verification_status: 'pending',
      });
    }

    // Log audit
    await db.auditLogs.create({
      user_id: newUser.id,
      action: 'USER_REGISTERED',
      entity_type: 'profile',
      entity_id: newUser.id,
      metadata: { role: newUser.role, email: newUser.email },
    });

    // Send welcome notification
    await db.notifications.create({
      user_id: newUser.id,
      title: 'Welcome to FOODLOOP!',
      message: `Your ${newUser.role.toUpperCase()} account has been created. Start exploring zero-waste rescue tools now.`,
      type: 'listing_alert',
      link: newUser.role === 'donor' ? '/donor' : newUser.role === 'ngo' ? '/ngo' : '/marketplace',
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        avatar_url: newUser.avatar_url,
        organization_name: newUser.organization_name,
        is_verified: newUser.is_verified,
      },
    });

    // Set cookie for session persistence
    response.cookies.set('foodloop_user_id', newUser.id, {
      path: '/',
      httpOnly: false,
      maxAge: 30 * 86400,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
