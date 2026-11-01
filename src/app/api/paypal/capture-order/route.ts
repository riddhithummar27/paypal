import { NextRequest, NextResponse } from 'next/server';
import { capturePayPalOrder } from '@/lib/paypal';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    const captureResult = await capturePayPalOrder(orderId);

    return NextResponse.json({
      success: true,
      capture: captureResult,
      timestamp: new Date().toISOString(),
      message: 'Transaction successfully processed via PayPal Sandbox',
    });
  } catch (err: any) {
    console.error('API /paypal/capture-order error:', err);
    return NextResponse.json({ error: err.message || 'Capture failed' }, { status: 500 });
  }
}
