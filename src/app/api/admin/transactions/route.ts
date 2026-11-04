import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
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
