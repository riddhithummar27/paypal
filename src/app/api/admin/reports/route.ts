import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-guard';
import { sanitizeString } from '@/lib/security';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, { allowedRoles: ['admin'], actionName: 'VIEW_REPORTS' });
  if ('response' in authResult) return authResult.response;

  try {
    const reports = await db.reports.list();
    return NextResponse.json({ success: true, count: reports.length, reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list reports.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    const body = await req.json();
    const { target_type, target_id, reason, description } = body;

    if (!target_type || !target_id || !reason) {
      return NextResponse.json({ error: 'target_type, target_id, and reason are required.' }, { status: 400 });
    }

    const reporterId = auth ? auth.user.id : body.reporter_id || 'anonymous';

    const report = await db.reports.create({
      reporter_id: reporterId,
      target_type: sanitizeString(target_type) as any,
      target_id: sanitizeString(target_id),
      reason: sanitizeString(reason),
      description: sanitizeString(description),
    });

    await db.auditLogs.create({
      user_id: reporterId !== 'anonymous' ? reporterId : undefined,
      action: 'REPORT_SUBMITTED',
      entity_type: 'report',
      entity_id: report.id,
      metadata: { targetType: target_type, targetId: target_id },
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create report.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const authResult = await requireAuth(req, { allowedRoles: ['admin'], actionName: 'RESOLVE_REPORT' });
  if ('response' in authResult) return authResult.response;

  try {
    const { reportId, status } = await req.json();
    if (!reportId || !status) {
      return NextResponse.json({ error: 'reportId and status are required.' }, { status: 400 });
    }

    const updated = await db.reports.updateStatus(reportId, sanitizeString(status) as any);
    if (!updated) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    await db.auditLogs.create({
      user_id: authResult.auth.user.id,
      action: `REPORT_${status.toUpperCase()}`,
      entity_type: 'report',
      entity_id: reportId,
      metadata: { status },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update report.' }, { status: 500 });
  }
}
