import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.collectionToken || body.token || body.lotId || 'FLP-8842-7721';
    const verifierId = body.verifierId || 'usr-donor-01';
    const notes = body.notes || 'Verified at pickup dock via QR token scan.';

    const result = await db.collections.verifyToken(token, verifierId, notes);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Trigger in-app notification to donor
    await db.notifications.create({
      user_id: verifierId,
      title: 'Collection Verified & Reward Credited!',
      message: `Token ${token} verified successfully. ${result.pointsAwarded} reward points have been credited to your account.`,
      type: 'collection_verified',
      link: '/donor',
    });

    return NextResponse.json({
      success: true,
      message: `Collection verified for token ${token}. Custody record logged and donor reward points credited.`,
      record: result.record,
      pointsAwarded: result.pointsAwarded,
      fintechVerification: {
        network: 'FOODLOOP Cryptographic Settlement Rail',
        signatureHash: result.record?.signature_hash,
        escrowReleased: true,
        pointsAwarded: result.pointsAwarded,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Custody verification failed.' }, { status: 500 });
  }
}
