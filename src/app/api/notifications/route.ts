import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || req.cookies.get('foodloop_user_id')?.value || undefined;

    const notifications = await db.notifications.list(userId);
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to list notifications.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { notificationId } = await req.json();
    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is required.' }, { status: 400 });
    }

    await db.notifications.markRead(notificationId);
    return NextResponse.json({ success: true, message: 'Notification marked as read.' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to mark notification.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, title, message, type, link } = body;

    if (!user_id || !title || !message) {
      return NextResponse.json({ error: 'user_id, title, and message are required.' }, { status: 400 });
    }

    const notif = await db.notifications.create({
      user_id,
      title,
      message,
      type: type || 'listing_alert',
      link,
    });

    return NextResponse.json({ success: true, notification: notif });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create notification.' }, { status: 500 });
  }
}
