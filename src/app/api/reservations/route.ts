import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get('recipientId') || undefined;
    const listingId = searchParams.get('listingId') || undefined;
    const status = searchParams.get('status') || undefined;

    const reservations = await db.reservations.list({ recipientId, listingId, status });
    return NextResponse.json({ success: true, count: reservations.length, reservations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve reservations.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listing_id, recipient_id, recipient_name, portions, paypal_order_id } = body;

    if (!listing_id) {
      return NextResponse.json({ error: 'listing_id is required.' }, { status: 400 });
    }

    const requestedPortions = Number(portions) || 1;
    if (requestedPortions <= 0) {
      return NextResponse.json({ error: 'Portions must be greater than zero.' }, { status: 400 });
    }

    const listing = await db.listings.findById(listing_id);
    if (!listing) {
      return NextResponse.json({ error: 'Food listing not found.' }, { status: 404 });
    }

    // Atomic Portions Reservation (Prevents Overbooking / Race Conditions)
    const reserveResult = await db.listings.atomicReserve(listing_id, requestedPortions);
    if (!reserveResult.success) {
      return NextResponse.json({ error: reserveResult.error }, { status: 409 });
    }

    // Generate Secure Unique Collection Token
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timePart = Date.now().toString().slice(-4);
    const collectionToken = `FLP-${listing.id}-${randPart}${timePart}`;

    const totalPrice = listing.listing_type === 'free' ? 0 : Number((listing.discounted_price * requestedPortions).toFixed(2));

    const newReservation = await db.reservations.create({
      listing_id,
      recipient_id: recipient_id || 'usr-recipient-01',
      recipient_name: recipient_name || 'Sarah Jenkins',
      portions: requestedPortions,
      total_price: totalPrice,
      status: 'confirmed',
      collection_token: collectionToken,
      pickup_deadline: listing.pickup_deadline,
      pickup_instructions: `Present token ${collectionToken} at pickup dock: ${listing.pickup_location}.`,
      paypal_order_id,
    });

    // Notify Donor
    await db.notifications.create({
      user_id: listing.donor_id,
      title: 'New Meal Reservation',
      message: `${newReservation.recipient_name} reserved ${requestedPortions} portions of "${listing.title}". Collection token: ${collectionToken}.`,
      type: 'reservation_update',
      link: '/donor',
    });

    // Notify Recipient
    await db.notifications.create({
      user_id: newReservation.recipient_id,
      title: 'Reservation Confirmed!',
      message: `Your reservation for "${listing.title}" is confirmed. Collection Token: ${collectionToken}.`,
      type: 'listing_alert',
      link: '/marketplace',
    });

    // Audit Log
    await db.auditLogs.create({
      user_id: newReservation.recipient_id,
      action: 'RESERVATION_CREATED',
      entity_type: 'reservation',
      entity_id: newReservation.id,
      metadata: { listingId: listing.id, portions: requestedPortions, token: collectionToken },
    });

    return NextResponse.json({
      success: true,
      message: 'Reservation created successfully.',
      reservation: newReservation,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create reservation.' }, { status: 500 });
  }
}
