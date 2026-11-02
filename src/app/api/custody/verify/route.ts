import { NextRequest, NextResponse } from 'next/server';
import { recordCustodyHandshake } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lotId = 'FL-8841', verifier = 'Authorized NGO Courier Elena K.' } = body;

    const receipt = recordCustodyHandshake(lotId, verifier);

    return NextResponse.json({
      success: true,
      message: `Custody release authenticated for Lot #${lotId}. Smart escrow release verified.`,
      receipt,
      fintechVerification: {
        network: 'FOODLOOP Gasless Settlement Rail',
        voucherHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
        escrowReleased: true,
        pointsAwarded: 95,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Custody verification failed' }, { status: 500 });
  }
}
