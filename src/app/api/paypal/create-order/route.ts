import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'USD', description = 'FoodLoop Surplus Transaction', referenceId = `FL-${Date.now()}` } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Valid positive amount is required' }, { status: 400 });
    }

    const order = await createPayPalOrder({
      amount,
      currency,
      description,
      referenceId,
    });

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('API /paypal/create-order error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
