import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { enforceRateLimit, getAuthenticatedUser } from '@/lib/auth-guard';
import { sanitizeString, sanitizeNumber } from '@/lib/security';

export async function POST(req: NextRequest) {
  // Enforce sliding-window rate limit (30 checkout requests / min per IP)
  const rateLimitError = enforceRateLimit(req, 'paypal', 30, 60);
  if (rateLimitError) return rateLimitError;

  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();
    const {
      amount,
      currency = 'USD',
      description = 'FOODLOOP Surplus Rescue Purchase',
      referenceId = `FL-${Date.now()}`,
      reservation_id,
      payment_type = 'meal_purchase',
    } = body;

    const numAmount = sanitizeNumber(amount, 0.01, 100000);
    if (!numAmount || numAmount <= 0) {
      return NextResponse.json({ error: 'Valid positive amount is required.' }, { status: 400 });
    }

    const userId = auth?.user?.id || body.user_id || 'usr-recipient-01';

    const order = await createPayPalOrder({
      amount: numAmount,
      currency: sanitizeString(currency) || 'USD',
      description: sanitizeString(description),
      referenceId: sanitizeString(referenceId),
    });

    if (order.id) {
      // Record initial payment attempt in database
      await db.payments.create({
        paypal_order_id: order.id,
        amount: numAmount,
        currency: currency || 'USD',
        status: 'created',
        payment_type: sanitizeString(payment_type) as any,
        user_id: userId,
        reservation_id: sanitizeString(reservation_id),
        raw_response: order,
      });

      await db.auditLogs.create({
        user_id: userId,
        action: 'PAYPAL_ORDER_CREATED',
        entity_type: 'payment',
        entity_id: order.id,
        metadata: { amount: numAmount, currency, referenceId, isSimulated: order.isSimulated },
      });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('API /paypal/create-order error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
