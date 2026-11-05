import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { logSecurityEvent, getClientIdentifier } from '@/lib/security';

export async function POST(req: NextRequest) {
  const ip = getClientIdentifier(req);

  try {
    const rawBody = await req.json();
    const eventType = rawBody.event_type || 'UNKNOWN';
    const resource = rawBody.resource || {};
    const eventId = rawBody.id || `evt-${Date.now().toString(36)}`;

    // PayPal Webhook transmission headers
    const transmissionId = req.headers.get('paypal-transmission-id') || eventId;
    const transmissionTime = req.headers.get('paypal-transmission-time') || new Date().toISOString();

    await logSecurityEvent({
      action: `PAYPAL_WEBHOOK_${eventType}`,
      metadata: {
        eventId,
        transmissionId,
        eventType,
        resourceId: resource.id,
      },
      ipAddress: ip,
    });

    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
      case 'CHECKOUT.ORDER.COMPLETED': {
        const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
        const captureId = resource.id;

        if (orderId) {
          const payment = await db.payments.findByOrderId(orderId);
          if (payment) {
            await db.payments.updateStatus(orderId, 'captured', captureId, resource);

            if (payment.reservation_id) {
              await db.reservations.updateStatus(payment.reservation_id, 'confirmed');
            }

            if (payment.user_id) {
              await db.notifications.create({
                user_id: payment.user_id,
                title: 'Sandbox Payment Confirmed',
                message: `Webhook confirmed PayPal Sandbox capture for Order #${orderId}.`,
                type: 'payment_status',
                link: '/marketplace',
              });
            }
          }
        }
        break;
      }

      case 'PAYMENT.CAPTURE.DENIED':
      case 'CHECKOUT.ORDER.FAILED': {
        const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
        if (orderId) {
          await db.payments.updateStatus(orderId, 'failed', undefined, resource);
        }
        break;
      }

      case 'PAYMENT.CAPTURE.REFUNDED': {
        const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id;
        if (orderId) {
          await db.payments.updateStatus(orderId, 'refunded', undefined, resource);
        }
        break;
      }

      default:
        // Generic event acknowledgment
        break;
    }

    return NextResponse.json({
      received: true,
      eventId,
      eventType,
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('PayPal webhook error:', err);
    return NextResponse.json(
      { error: err.message || 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
