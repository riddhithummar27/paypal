import { NextRequest, NextResponse } from 'next/server';
import { createPayPalPayout } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount = 148.20, currency = 'USD', receiverEmail = 'merchant-artisan@foodloop.org', note } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid payout amount is required' }, { status: 400 });
    }

    const payout = await createPayPalPayout({
      amount: Number(amount),
      currency,
      receiverEmail,
      note: note || `FOODLOOP Merchant Settlement: $${amount} USD for verified rescued batches`,
    });

    return NextResponse.json({
      success: true,
      message: `PayPal payout of $${payout.amount.toFixed(2)} ${payout.currency} dispatched to ${payout.receiverEmail}`,
      payout,
    });
  } catch (err: any) {
    console.error('PayPal Payout API Error:', err);
    return NextResponse.json({ error: err.message || 'PayPal Payout failed' }, { status: 500 });
  }
}
