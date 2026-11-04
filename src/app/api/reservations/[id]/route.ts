import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const reservation = await db.reservations.findById(id);
    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, reservation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve reservation.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, cancellation_reason } = await req.json();

    const reservation = await db.reservations.findById(id);
    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
    }

    // If cancelling or rejecting, restore portions to listing
    if ((status === 'cancelled' || status === 'rejected') && reservation.status === 'confirmed') {
      const listing = await db.listings.findById(reservation.listing_id);
      if (listing) {
        await db.listings.update(listing.id, {
          remaining_portions: listing.remaining_portions + reservation.portions,
          status: 'available',
        });
      }
    }

    const updated = await db.reservations.updateStatus(id, status, cancellation_reason);

    // Notify recipient of status update
    await db.notifications.create({
      user_id: reservation.recipient_id,
      title: `Reservation ${status.toUpperCase()}`,
      message: cancellation_reason
        ? `Your reservation #${id} was ${status}: ${cancellation_reason}`
        : `Your reservation #${id} status is now ${status}.`,
      type: 'reservation_update',
      link: '/marketplace',
    });

    await db.auditLogs.create({
      user_id: reservation.recipient_id,
      action: `RESERVATION_${status.toUpperCase()}`,
      entity_type: 'reservation',
      entity_id: id,
      metadata: { previousStatus: reservation.status, newStatus: status, reason: cancellation_reason },
    });

    return NextResponse.json({ success: true, reservation: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update reservation.' }, { status: 500 });
  }
}
