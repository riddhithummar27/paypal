import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const logs = await db.auditLogs.list();
    return NextResponse.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list audit logs.' }, { status: 500 });
  }
}
