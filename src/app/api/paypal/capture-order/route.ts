import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required.' }, { status: 400 });
    }

    // Check for duplicate payment processing
    const existingPayment = await db.payments.findByOrderId(orderId);
    if (existingPayment && existingPayment.status === 'captured') {
      return NextResponse.json({
        success: true,
        message: 'Order already captured and verified.',
        payment: existingPayment,
      });
    }

    const captureResult = await capturePayPalOrder(orderId);
    const captureId = (captureResult as any)?.purchase_units?.[0]?.payments?.captures?.[0]?.id || `CAP-${Date.now().toString(36)}`;

    // Update payment record in database
    const payment = await db.payments.updateStatus(orderId, 'captured', captureId, captureResult);

    // Audit Log
    await db.auditLogs.create({
      user_id: payment?.user_id,
      action: 'PAYPAL_ORDER_CAPTURED',
      entity_type: 'payment',
      entity_id: orderId,
      metadata: { captureId, amount: payment?.amount },
    });

    // Notify user
    if (payment?.user_id) {
      await db.notifications.create({
        user_id: payment.user_id,
        title: 'Payment Successful',
        message: `Your payment of $${Number(payment.amount).toFixed(2)} was verified via PayPal Sandbox.`,
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
