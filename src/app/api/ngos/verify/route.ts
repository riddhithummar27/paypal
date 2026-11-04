import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ngoId = searchParams.get('ngoId') || undefined;

    const verifications = await db.ngos.listVerifications(ngoId);
    return NextResponse.json({ success: true, count: verifications.length, verifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list verification documents.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ngo_id, document_name, document_url, document_type } = body;

    if (!ngo_id || !document_name) {
      return NextResponse.json({ error: 'ngo_id and document_name are required.' }, { status: 400 });
    }

    const doc = await db.ngos.submitVerification({
      ngo_id,
      document_name,
      document_url: document_url || 'https://foodloop.org/docs/sample_ngo_certificate.pdf',
      document_type: document_type || '501(c)(3) Tax Exemption Document',
    });

    // Notify admins of new pending NGO verification
    await db.notifications.create({
      user_id: 'usr-admin-01',
      title: 'New NGO Verification Submitted',
      message: `Document "${document_name}" submitted for NGO #${ngo_id}. Review required.`,
      type: 'ngo_verified',
      link: '/agent',
    });

    await db.auditLogs.create({
      action: 'NGO_VERIFICATION_SUBMITTED',
      entity_type: 'ngo_verification',
      entity_id: doc.id,
      metadata: { ngoId: ngo_id, docName: document_name },
    });

    return NextResponse.json({
      success: true,
      message: 'Verification document submitted successfully and queued for admin review.',
      verification: doc,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit verification.' }, { status: 500 });
  }
}
