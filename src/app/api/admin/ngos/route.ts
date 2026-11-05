import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-guard';
import { sanitizeString } from '@/lib/security';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, { allowedRoles: ['admin'], actionName: 'VIEW_NGO_VERIFICATIONS' });
  if ('response' in authResult) return authResult.response;

  try {
    const ngos = await db.ngos.list();
    const verifications = await db.ngos.listVerifications();

    const enriched = ngos.map((ngo) => ({
      ...ngo,
      documents: verifications.filter((v) => v.ngo_id === ngo.id),
    }));

    return NextResponse.json({ success: true, count: enriched.length, ngos: enriched });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list NGOs for admin.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireAuth(req, { allowedRoles: ['admin'], actionName: 'REVIEW_NGO_VERIFICATION' });
  if ('response' in authResult) return authResult.response;

  try {
    const { verificationId, status, notes } = await req.json();

    if (!verificationId || !status) {
      return NextResponse.json({ error: 'verificationId and status are required.' }, { status: 400 });
    }

    const reviewed = await db.ngos.reviewVerification(
      verificationId,
      authResult.auth.user.id,
      status as 'approved' | 'rejected',
      sanitizeString(notes) || (status === 'approved' ? 'Verified valid IRS non-profit exemption.' : 'Verification rejected.')
    );

    if (!reviewed) {
      return NextResponse.json({ error: 'Verification document not found.' }, { status: 404 });
    }

    const ngo = await db.ngos.findById(reviewed.ngo_id);
    if (ngo?.profile_id) {
      await db.notifications.create({
        user_id: ngo.profile_id,
        title: `NGO Verification ${status === 'approved' ? 'Approved! 🎉' : 'Needs Attention'}`,
        message:
          status === 'approved'
            ? 'Your organization has been officially verified! You now have unrestricted access to bulk food claims and volunteer dispatch.'
            : `Your verification submission was not approved: ${notes || 'Please resubmit valid documentation.'}`,
        type: 'ngo_verified',
        link: '/ngo',
      });
    }

    await db.auditLogs.create({
      user_id: authResult.auth.user.id,
      action: `NGO_VERIFICATION_${status.toUpperCase()}`,
      entity_type: 'ngo_verification',
      entity_id: verificationId,
      metadata: { status, notes },
    });

    return NextResponse.json({ success: true, verification: reviewed });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to review verification.' }, { status: 500 });
  }
}
