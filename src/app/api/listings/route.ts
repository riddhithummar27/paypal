import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const donorId = searchParams.get('donorId') || undefined;
    const search = searchParams.get('q') || undefined;

    const listings = await db.listings.list({ category, status, donorId, search });

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve listings.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      donor_id,
      donor_name,
      donor_type,
      category_id,
      listing_type,
      portions,
      original_price,
      discounted_price,
      pickup_location,
      lat,
      lng,
      pickup_deadline,
      allergens,
      storage_temp,
      image_url,
      safety_declaration,
    } = body;

    // Strict Server-Side Validations (Section 5)
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Food title is required.' }, { status: 400 });
    }

    const numPortions = Number(portions);
    if (!numPortions || numPortions <= 0 || !Number.isInteger(numPortions)) {
      return NextResponse.json({ error: 'Portions must be a positive whole number.' }, { status: 400 });
    }

    if (!pickup_location || !pickup_location.trim()) {
      return NextResponse.json({ error: 'Pickup location/address is required.' }, { status: 400 });
    }

    // Validate pickup deadline (must not be expired)
    const deadlineDate = pickup_deadline ? new Date(pickup_deadline) : new Date(Date.now() + 3 * 3600 * 1000);
    if (isNaN(deadlineDate.getTime()) || deadlineDate.getTime() <= Date.now()) {
      return NextResponse.json({ error: 'Pickup deadline must be a future time/date.' }, { status: 400 });
    }

    const mode = listing_type || (body.isFree ? 'free' : 'discount');

    const newListing = await db.listings.create({
      donor_id: donor_id || 'usr-donor-01',
      donor_name: donor_name || 'Artisan Kitchen',
      donor_type: donor_type || 'Restaurant',
      title: title.trim(),
      description: description || 'Fresh surplus food verified compliant with regional safety guidelines.',
      category_id: category_id || body.category?.toLowerCase() || 'meals',
      listing_type: mode,
      portions: numPortions,
      remaining_portions: numPortions,
      original_price: Number(original_price) || 0,
      discounted_price: mode === 'free' ? 0 : Number(discounted_price || body.currentPrice) || 4.5,
      image_url:
        image_url ||
        body.imageUrl ||
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      prep_time: body.prep_time || body.prepTime || 'Freshly Prepared',
      storage_temp: storage_temp || body.tempProfile || body.storageTemp || 'Ambient (18°C)',
      allergens: allergens || ['Gluten-Free Option Available'],
      pickup_location: pickup_location.trim(),
      lat: Number(lat) || 42.3498,
      lng: Number(lng) || -71.0805,
      pickup_deadline: deadlineDate.toISOString(),
      safety_declaration: Boolean(safety_declaration ?? true),
      status: 'available',
    });

    // Create Audit Log
    await db.auditLogs.create({
      user_id: newListing.donor_id,
      action: 'LISTING_CREATED',
      entity_type: 'food_listing',
      entity_id: newListing.id,
      metadata: { portions: newListing.portions, mode: newListing.listing_type },
    });

    // Notify community of new nearby surplus food
    await db.notifications.create({
      user_id: 'usr-recipient-01',
      title: 'New Surplus Food Near You!',
      message: `${newListing.donor_name} just listed ${newListing.portions} portions of "${newListing.title}".`,
      type: 'listing_alert',
      link: '/marketplace',
    });

    return NextResponse.json({
      success: true,
      message: 'Surplus food listing successfully published.',
      listing: newListing,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create food listing.' }, { status: 500 });
  }
}
