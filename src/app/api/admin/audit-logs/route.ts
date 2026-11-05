import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth(req, { allowedRoles: ['admin'], actionName: 'VIEW_AUDIT_LOGS' });
  if ('response' in authResult) return authResult.response;

  try {
    const logs = await db.auditLogs.list();
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list audit logs.' }, { status: 500 });
  }
}
