import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reports = await db.reports.list();
    return NextResponse.json({ success: true, count: reports.length, reports });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list reports.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target_type, target_id, reason, description, reporter_id } = body;

    if (!target_type || !target_id || !reason) {
      return NextResponse.json({ error: 'target_type, target_id, and reason are required.' }, { status: 400 });
    }

    const report = await db.reports.create({
      reporter_id: reporter_id || 'usr-recipient-01',
      target_type,
      target_id,
      reason,
      description,
    });

    await db.auditLogs.create({
      user_id: reporter_id,
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
  try {
    const { reportId, status } = await req.json();
    if (!reportId || !status) {
      return NextResponse.json({ error: 'reportId and status are required.' }, { status: 400 });
    }

    const updated = await db.reports.updateStatus(reportId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }

    await db.auditLogs.create({
      action: `REPORT_${status.toUpperCase()}`,
      entity_type: 'report',
      entity_id: reportId,
      metadata: { status },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update report status.' }, { status: 500 });
  }
}
