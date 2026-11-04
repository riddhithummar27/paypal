import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      currency = 'USD',
      description = 'FOODLOOP Surplus Rescue Purchase',
      referenceId = `FL-${Date.now()}`,
      user_id,
      reservation_id,
      payment_type = 'meal_purchase',
    } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Valid positive amount is required.' }, { status: 400 });
    }

    const order = await createPayPalOrder({
      amount: numAmount,
      currency,
      description,
      referenceId,
    });

    if (order.id) {
      // Record initial payment attempt in database
      await db.payments.create({
        paypal_order_id: order.id,
        amount: numAmount,
        currency,
        status: 'created',
        payment_type,
        user_id,
        reservation_id,
        raw_response: order,
      });

      await db.auditLogs.create({
        user_id,
        action: 'PAYPAL_ORDER_CREATED',
        entity_type: 'payment',
        entity_id: order.id,
        metadata: { amount: numAmount, currency, referenceId },
      });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('API /paypal/create-order error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
