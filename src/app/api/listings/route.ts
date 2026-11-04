import { NextRequest, NextResponse } from 'next/server';
import { getListingsStore, addListingToStore, updateListingInStore } from '@/lib/store';
import { FoodListing } from '@/types/foodloop';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('q');

    let listings = getListingsStore();

    if (category && category !== 'all') {
      listings = listings.filter((l) => l.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'all') {
      listings = listings.filter((l) => l.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      listings = listings.filter(
        (l) => l.title.toLowerCase().includes(q) || l.donorName.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve listings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, donorName, donorType, category, portions, originalPrice, currentPrice, isFree } = body;

    if (!title || !portions) {
      return NextResponse.json({ error: 'Title and portions are required' }, { status: 400 });
    }

    const newListing: FoodListing = {
      id: `FL-${Date.now().toString().slice(-4)}`,
      title,
      donorName: donorName || 'Verified Donor Partner',
      donorType: donorType || 'Restaurant',
      category: category || 'Meals',
      portions: Number(portions),
      originalPrice: Number(originalPrice) || 0,
      currentPrice: isFree ? 0 : Number(currentPrice) || 0,
      discountPercent: isFree
        ? 100
        : originalPrice && currentPrice
        ? Math.round((1 - currentPrice / originalPrice) * 100)
        : 70,
      isFree: Boolean(isFree),
      prepTime: body.prepTime || 'Freshly Prepared',
      expiryTime: body.expiryTime || 'Within 2 hours',
      pickupDeadlineMinutes: Number(body.pickupDeadlineMinutes) || 60,
      location: body.location || 'Metro Hub (Zone 1)',
      distanceKm: Number(body.distanceKm) || 0.8,
      lat: Number(body.lat) || Number((42.3500 + Math.random() * 0.015).toFixed(4)),
      lng: Number(body.lng) || Number((-71.0600 - Math.random() * 0.015).toFixed(4)),
      allergens: body.allergens || [],
      storageTemp: body.storageTemp || 'Hot (>60°C)',
      safetyDeclaration: true,
      imageUrl:
        body.imageUrl ||
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      status: 'available',
    };

    const saved = addListingToStore(newListing);

    return NextResponse.json({
      success: true,
      message: 'Surplus listing successfully created and published to regional nodes',
      listing: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, claimedBy, paypalOrderId } = body;

    if (!id) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    const updated = updateListingInStore(id, {
      status,
      claimedBy,
      paypalOrderId,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Listing ${id} updated to status ${status}`,
      listing: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}
