import { NextRequest, NextResponse } from 'next/server';
import { checkPayPalSandboxHealth } from '@/lib/paypal';
import { enforceRateLimit } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  // Moderate rate limiting on sandbox status probe
  const rateLimitError = enforceRateLimit(req, 'paypal', 60, 60);
  if (rateLimitError) return rateLimitError;

  try {
    const health = await checkPayPalSandboxHealth();

    return NextResponse.json({
      success: true,
      sandbox: health,
      endpoints: {
        oauth: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        orders: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        captures: 'https://api-m.sandbox.paypal.com/v2/payments/captures',
        payouts: 'https://api-m.sandbox.paypal.com/v1/payments/payouts',
        webhooks: '/api/paypal/webhook',
      },
      testAccounts: {
        buyerPersonal: {
          email: 'buyer-sandbox@foodloop.org',
          type: 'Personal / Recipient',
          defaultBalance: '$5,000.00 USD (Sandbox)',
        },
        merchantBusiness: {
          email: 'merchant-sandbox@foodloop.org',
          type: 'Business / Platform Escrow',
          capabilities: ['Orders v2', 'Captures v2', 'Disbursements / Payouts'],
        },
      },
      securityFeatures: {
        idempotencyKeys: 'Enabled via PayPal-Request-Id',
        rateLimiter: 'Sliding-window in-memory active (30 req/min)',
        tamperProtection: 'HMAC-SHA256 session signature & verified captures',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to inspect PayPal sandbox status',
      },
      { status: 500 }
    );
  }
}
