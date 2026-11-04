import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const listing = await db.listings.findById(id);
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, listing });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve listing.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.listings.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    const updated = await db.listings.update(id, body);

    await db.auditLogs.create({
      user_id: existing.donor_id,
      action: 'LISTING_UPDATED',
      entity_type: 'food_listing',
      entity_id: id,
      metadata: { updatedFields: Object.keys(body) },
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update listing.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await db.listings.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    await db.listings.delete(id);

    await db.auditLogs.create({
      user_id: existing.donor_id,
      action: 'LISTING_DELETED',
      entity_type: 'food_listing',
      entity_id: id,
      metadata: { title: existing.title },
    });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete listing.' }, { status: 500 });
  }
}
