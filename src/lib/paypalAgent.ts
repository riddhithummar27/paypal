import { PayPalAgentToolkit } from '@paypal/agent-toolkit/ai-sdk';

/**
 * PayPal Agent Toolkit Initializer
 * Provides official tools for Vercel AI SDK and OpenAI agent execution:
 * - Orders management (create, check, capture)
 * - Invoices management (create draft, send, view)
 * - Disputes & Payments inspection
 */

export function getPayPalAgentToolkit() {
  const clientId = process.env.PAYPAL_CLIENT_ID || 'test';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'test';

  try {
    const toolkit = new PayPalAgentToolkit({
      clientId,
      clientSecret,
      configuration: {
        actions: {
          orders: {
            createOrder: true,
            getOrderDetails: true,
          },
          invoices: {
            createDraftInvoice: true,
            getInvoiceDetails: true,
          },
          payments: {
            getPaymentDetails: true,
          },
        },
        context: {
          sandbox: true,
          debug: false,
        },
      },
    });

    return toolkit;
  } catch (err) {
    console.warn('Could not initialize PayPalAgentToolkit directly:', err);
    return null;
  }
}
