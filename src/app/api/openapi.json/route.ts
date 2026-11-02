import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'FOODLOOP 2.0 AI Surplus Redistribution API',
      version: '2.0.0',
      description:
        'Official REST API for FOODLOOP 2.0, connecting food donors, AI rescue agents, and PayPal payment rails for surplus food redistribution and sponsored community meals. Built for the PayPal & AI Global Hackathon with APIMatic compatibility.',
      contact: {
        name: 'FOODLOOP Dev Team',
        url: 'https://github.com/paypal/AI-Toolkit',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
    paths: {
      '/api/paypal/create-order': {
        post: {
          summary: 'Create PayPal Sandbox Order',
          description: 'Generates a PayPal v2 order for discounted surplus purchase or community meal sponsorship.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount'],
                  properties: {
                    amount: { type: 'number', example: 12.5 },
                    currency: { type: 'string', example: 'USD' },
                    description: { type: 'string', example: 'Sponsored 5 Community Meals' },
                    referenceId: { type: 'string', example: 'FL-SPON-101' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order created successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'SANDBOX-ORD-12345' },
                      status: { type: 'string', example: 'CREATED' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/paypal/capture-order': {
        post: {
          summary: 'Capture PayPal Sandbox Order',
          description: 'Captures and finalizes payment for an authorized order.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['orderId'],
                  properties: {
                    orderId: { type: 'string', example: 'SANDBOX-ORD-12345' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Order captured and verified',
            },
          },
        },
      },
      '/api/paypal/payout': {
        post: {
          summary: 'Donor Surplus Payout via PayPal',
          description: 'Executes an instant payout transfer to a food donor merchant account via PayPal Payouts API.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    amount: { type: 'number', example: 148.20 },
                    currency: { type: 'string', example: 'USD' },
                    receiverEmail: { type: 'string', example: 'merchant-artisan@foodloop.org' },
                    note: { type: 'string', example: 'FOODLOOP Surplus Donor Ledger Settlement' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Payout dispatched successfully',
            },
          },
        },
      },
      '/api/paypal/agent-toolkit': {
        get: {
          summary: 'Inspect PayPal Agent Toolkit State',
          description: 'Returns available tools and runtime configuration of @paypal/agent-toolkit/ai-sdk.',
        },
        post: {
          summary: 'Execute Agentic PayPal Action',
          description: 'Runs draft invoice generation, order creation, or payment inspection using official PayPal tools.',
        },
      },
      '/api/ai/pricing-engine': {
        post: {
          summary: 'Dynamic Shelf-Life Decay Pricing',
          description: 'Calculates perishable food discount curve based on minutes remaining and category decay rate.',
        },
      },
      '/api/ai/rescue-agent': {
        post: {
          summary: 'Autonomous Multi-Node Batch Allocation',
          description: 'Decomposes high-volume surplus into optimal shelter drops and courier dispatch schedules.',
        },
      },
      '/api/ai/agent-chat': {
        post: {
          summary: 'PayPal Agent Toolkit Function Calling Endpoint',
          description: 'Natural language interface powered by PayPal Agent Toolkit for orders, invoices, and triage.',
        },
      },
      '/api/listings': {
        get: {
          summary: 'Get Active Food Surplus Listings',
          description: 'Fetches active listings with filtering by category, status, and search query.',
        },
        post: {
          summary: 'Publish New Surplus Food Batch',
          description: 'Enters a new food surplus batch into regional rescue pipelines.',
        },
        patch: {
          summary: 'Update Listing Status',
          description: 'Updates listing status upon reservation, claim, or PayPal order checkout.',
        },
      },
      '/api/custody/verify': {
        post: {
          summary: 'Authenticate Custody Handshake',
          description: 'Validates QR code custody release between donor and courier, releasing smart escrow rewards.',
        },
      },
      '/api/dispatches': {
        get: {
          summary: 'Get Bryntum Logistics Dispatch Slots',
          description: 'Retrieves all active courier and shelter delivery slots.',
        },
        post: {
          summary: 'Schedule New Dispatch Slot',
          description: 'Creates a rapid 30-45m transit slot in the Bryntum scheduler.',
        },
        patch: {
          summary: 'Advance Dispatch Status',
          description: 'Advances slot status from Volunteer Assigned to In Transit to Delivered.',
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
