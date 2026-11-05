import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  hashPassword,
  createSessionToken,
  isValidEmail,
  sanitizeString,
  logSecurityEvent,
  getClientIdentifier,
} from '@/lib/security';
import { enforceRateLimit } from '@/lib/auth-guard';

export async function POST(req: NextRequest) {
  // 1. Rate limiting on registration
  const rateLimitError = enforceRateLimit(req, 'auth', 15, 60);
  if (rateLimitError) return rateLimitError;

  const ip = getClientIdentifier(req);

  try {
    const body = await req.json();
    const email = sanitizeString(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const fullName = sanitizeString(body.full_name);
    const rawRole = sanitizeString(body.role);
    const orgName = sanitizeString(body.organization_name);
    const phone = sanitizeString(body.phone);
    const address = sanitizeString(body.address);
    const city = sanitizeString(body.city);
    const state = sanitizeString(body.state);

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Email, password, and full name are required.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long for security compliance.' },
        { status: 400 }
      );
    }

    // Role-Based Restriction: Admin accounts must be securely provisioned, never freely selectable in public registration
    const requestedRole = (rawRole || 'recipient').toLowerCase();
    if (requestedRole === 'admin') {
      await logSecurityEvent({
        action: 'PUBLIC_ADMIN_REGISTRATION_DENIED',
        metadata: { email, attemptedRole: 'admin' },
        ipAddress: ip,
      });
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

    // Hash password with scrypt
    const passwordHash = hashPassword(password);

    const newUser = await db.users.create({
      email,
      passwordHash,
      full_name: fullName,
      role: requestedRole as 'donor' | 'recipient' | 'ngo',
      organization_name: orgName,
      phone,
      address,
      city,
      state,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      is_verified: requestedRole === 'ngo' ? false : true,
    });

    // If NGO, create corresponding NGO profile
    if (requestedRole === 'ngo') {
      await db.ngos.create({
        profile_id: newUser.id,
        name: orgName || fullName,
        registration_number: sanitizeString(body.registration_number) || 'REG-PENDING',
        tax_id: sanitizeString(body.tax_id) || 'TAX-PENDING',
        mission_statement: sanitizeString(body.mission_statement) || 'Community food rescue and distribution.',
        capacity_portions_per_day: 500,
        cooling_capacity_liters: 250,
        fleet_vehicles: 2,
        verification_status: 'pending',
      });
    }

    // Create session token
    const sessionToken = createSessionToken({
      userId: newUser.id,
      role: newUser.role,
      email: newUser.email,
    });

    // Log audit
    await db.auditLogs.create({
      user_id: newUser.id,
      action: 'USER_REGISTERED',
      entity_type: 'profile',
      entity_id: newUser.id,
      metadata: { role: newUser.role, email: newUser.email },
      ip_address: ip,
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
      token: sessionToken,
    });

    // Set secure cookies
    response.cookies.set('foodloop_session', sessionToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 86400,
    });

    response.cookies.set('foodloop_user_id', newUser.id, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 30 * 86400,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error.' }, { status: 500 });
  }
}
