import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || req.cookies.get('foodloop_user_id')?.value || 'usr-donor-01';

    const balance = await db.rewards.getBalance(userId);
    const transactions = await db.rewards.listTransactions(userId);
    const coupons = await db.rewards.listCoupons();

    return NextResponse.json({
      success: true,
      balance,
      transactions,
      coupons,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to retrieve reward details.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || req.cookies.get('foodloop_user_id')?.value || 'usr-donor-01';
    const { couponCode } = body;

    if (!couponCode) {
      return NextResponse.json({ error: 'couponCode is required.' }, { status: 400 });
    }

    const result = await db.rewards.redeemCoupon(userId, couponCode);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Notify user of reward redemption
    await db.notifications.create({
      user_id: userId,
      title: 'Partner Reward Redeemed! 🎟️',
      message: `You successfully redeemed ${result.coupon?.points_required} points for ${result.coupon?.title}. Voucher code: ${result.coupon?.code}.`,
      type: 'points_credited',
      link: '/donor',
    });

    return NextResponse.json({
      success: true,
      message: `Successfully redeemed coupon "${result.coupon?.title}"!`,
      coupon: result.coupon,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to redeem coupon.' }, { status: 500 });
  }
}
