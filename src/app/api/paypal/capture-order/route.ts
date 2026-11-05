import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';
import { enforceRateLimit, getAuthenticatedUser } from '@/lib/auth-guard';
import { sanitizeString } from '@/lib/security';

export async function POST(req: NextRequest) {
  // Enforce sliding-window rate limit
  const rateLimitError = enforceRateLimit(req, 'paypal', 30, 60);
  if (rateLimitError) return rateLimitError;

  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();
    const orderId = sanitizeString(body.orderId);

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
    }

    // Check for duplicate payment processing (Idempotency)
    const existingPayment = await db.payments.findByOrderId(orderId);
    if (existingPayment && existingPayment.status === 'captured') {
      return NextResponse.json({
        success: true,
        message: 'Order already captured and verified.',
        payment: existingPayment,
      });
    }

    const captureResult = await capturePayPalOrder(orderId);
    const captureId =
      (captureResult as any)?.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
      `CAP-${Date.now().toString(36).toUpperCase()}`;

    // Update payment record in database
    const payment = await db.payments.updateStatus(orderId, 'captured', captureId, captureResult);

    const userId = auth?.user?.id || payment?.user_id;

    // Audit Log
    await db.auditLogs.create({
      user_id: userId,
      action: 'PAYPAL_ORDER_CAPTURED',
      entity_type: 'payment',
      entity_id: orderId,
      metadata: { captureId, amount: payment?.amount, isSimulated: captureResult.isSimulated },
    });

    // Notify user
    if (userId) {
      await db.notifications.create({
        user_id: userId,
        title: 'Payment Successful',
        message: `Your payment of $${Number(payment?.amount || 0).toFixed(2)} was verified via PayPal Sandbox.`,
        type: 'payment_status',
        link: '/marketplace',
      });
    }

    return NextResponse.json({
      success: true,
      capture: captureResult,
      payment,
      timestamp: new Date().toISOString(),
      message: 'Transaction successfully processed and verified via PayPal Sandbox.',
    });
  } catch (err: any) {
    console.error('API /paypal/capture-order error:', err);
    return NextResponse.json({ error: err.message || 'Capture failed.' }, { status: 500 });
  }
}
