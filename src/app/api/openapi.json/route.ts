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
    },
  };

  return NextResponse.json(openApiSpec);
}
