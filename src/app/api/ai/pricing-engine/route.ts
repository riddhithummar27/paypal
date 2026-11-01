import { NextRequest, NextResponse } from 'next/server';

interface PricingRequest {
  originalPrice: number;
  minutesRemaining: number;
  category: 'Meals' | 'Bakery' | 'Produce' | 'Dairy' | 'Packaged' | 'Beverages';
  storageTemp: string;
  portions: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: PricingRequest = await req.json();
    const { originalPrice, minutesRemaining, category, storageTemp, portions } = body;

    if (originalPrice <= 0) {
      return NextResponse.json({
        recommendedPrice: 0,
        discountPercent: 100,
        reasoning: 'Listing marked as pure free donation.',
        urgency: 'Standard',
      });
    }

    // Category perishability multiplier
    let categoryUrgencyFactor = 1.0;
    if (category === 'Meals' && storageTemp.includes('Hot')) {
      categoryUrgencyFactor = 1.35; // Hot meals must be collected rapidly to preserve food safety
    } else if (category === 'Dairy' || category === 'Produce') {
      categoryUrgencyFactor = 1.2;
    } else if (category === 'Bakery') {
      categoryUrgencyFactor = 1.1;
    } else {
      categoryUrgencyFactor = 0.9;
    }

    // Dynamic discount decay curve:
    // > 180 mins: 30% - 40% discount
    // 90 - 180 mins: 45% - 55% discount
    // 30 - 90 mins: 60% - 70% discount
    // < 30 mins: 75% - 85% discount
    let baseDiscount = 30;
    if (minutesRemaining <= 30) {
      baseDiscount = 75;
    } else if (minutesRemaining <= 60) {
      baseDiscount = 65;
    } else if (minutesRemaining <= 120) {
      baseDiscount = 50;
    } else if (minutesRemaining <= 180) {
      baseDiscount = 40;
    }

    const calculatedDiscount = Math.min(85, Math.round(baseDiscount * categoryUrgencyFactor));
    const recommendedPrice = Math.max(0.99, Number((originalPrice * (1 - calculatedDiscount / 100)).toFixed(2)));

    // Food Safety Guidance check
    const safetyRecommendations = [];
    if (storageTemp.includes('Hot')) {
      safetyRecommendations.push('Keep hot held at ≥60°C. Transport in insulated thermal containers.');
    } else if (storageTemp.includes('Chilled')) {
      safetyRecommendations.push('Keep refrigerated at ≤5°C. Safe transit duration is up to 45 mins.');
    } else {
      safetyRecommendations.push('Keep sealed in food-grade packaging away from direct heat.');
    }

    return NextResponse.json({
      recommendedPrice,
      originalPrice,
      discountPercent: calculatedDiscount,
      projectedSavingsTotal: Number(((originalPrice - recommendedPrice) * portions).toFixed(2)),
      estimatedRescueProbability: calculatedDiscount >= 60 ? '94%' : '78%',
      urgencyTier: minutesRemaining <= 45 ? 'CRITICAL_WINDOW' : 'ACTIVE_WINDOW',
      safetyRecommendations,
      explanation: `AI dynamic decay model applied a ${calculatedDiscount}% markdown based on ${minutesRemaining}m remaining window and ${category} perishability characteristics.`,
    });
  } catch (err: any) {
    console.error('Pricing engine error:', err);
    return NextResponse.json({ error: 'Failed to compute dynamic pricing' }, { status: 500 });
  }
}
