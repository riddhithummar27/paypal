import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let ngos = await db.ngos.list();
    if (status) {
      ngos = ngos.filter((n) => n.verification_status === status);
    }

    return NextResponse.json({ success: true, count: ngos.length, ngos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list NGOs.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, profile_id, registration_number, tax_id, mission_statement, capacity_portions_per_day } = body;

    if (!name) {
      return NextResponse.json({ error: 'NGO name is required.' }, { status: 400 });
    }

    const newNgo = await db.ngos.create({
      name,
      profile_id: profile_id || 'usr-ngo-01',
      registration_number: registration_number || 'REG-PENDING',
      tax_id: tax_id || 'TAX-PENDING',
      mission_statement: mission_statement || 'Community food rescue and shelter supply.',
      capacity_portions_per_day: Number(capacity_portions_per_day) || 600,
      cooling_capacity_liters: 300,
      fleet_vehicles: 2,
      verification_status: 'pending',
    });

    await db.auditLogs.create({
      user_id: newNgo.profile_id,
      action: 'NGO_REGISTERED',
      entity_type: 'ngo',
      entity_id: newNgo.id,
      metadata: { name: newNgo.name },
    });

    return NextResponse.json({ success: true, ngo: newNgo });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create NGO profile.' }, { status: 500 });
  }
}
