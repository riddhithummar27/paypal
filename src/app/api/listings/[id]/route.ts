import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth-guard';
import { logSecurityEvent, getClientIdentifier } from '@/lib/security';

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
  const ip = getClientIdentifier(req);
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();

    const existing = await db.listings.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    // Ownership check: must be owner donor or admin
    if (auth && auth.user.role !== 'admin' && existing.donor_id !== auth.user.id) {
      await logSecurityEvent({
        action: 'UNAUTHORIZED_LISTING_UPDATE_ATTEMPT',
        userId: auth.user.id,
        metadata: { listingId: id, ownerId: existing.donor_id },
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to modify listings created by another donor.' },
        { status: 403 }
      );
    }

    const updated = await db.listings.update(id, body);

    await db.auditLogs.create({
      user_id: auth?.user?.id || existing.donor_id,
      action: 'LISTING_UPDATED',
      entity_type: 'food_listing',
      entity_id: id,
      metadata: { updatedFields: Object.keys(body) },
      ip_address: ip,
    });

    return NextResponse.json({ success: true, listing: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update listing.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const ip = getClientIdentifier(req);
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser(req);

    const existing = await db.listings.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Listing not found.' }, { status: 404 });
    }

    // Ownership check: must be owner donor or admin
    if (auth && auth.user.role !== 'admin' && existing.donor_id !== auth.user.id) {
      await logSecurityEvent({
        action: 'UNAUTHORIZED_LISTING_DELETE_ATTEMPT',
        userId: auth.user.id,
        metadata: { listingId: id, ownerId: existing.donor_id },
        ipAddress: ip,
      });
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete listings created by another donor.' },
        { status: 403 }
      );
    }

    await db.listings.delete(id);

    await db.auditLogs.create({
      user_id: auth?.user?.id || existing.donor_id,
      action: 'LISTING_DELETED',
      entity_type: 'food_listing',
      entity_id: id,
      metadata: { title: existing.title },
      ip_address: ip,
    });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete listing.' }, { status: 500 });
  }
}
