import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, { allowedRoles: ['admin'], actionName: 'VIEW_PAYPAL_TRANSACTIONS' });
  if ('response' in authResult) return authResult.response;

  try {
    const payments = await db.payments.list();
    const totalVolume = payments.reduce((acc, p) => acc + (p.status === 'captured' ? p.amount : 0), 0);

    return NextResponse.json({
      success: true,
      count: payments.length,
      totalVolume,
      transactions: payments,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list transactions.' }, { status: 500 });
  }
}
