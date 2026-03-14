import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { amount, invoiceId } = await req.json();

    if (!amount || !invoiceId) {
        return NextResponse.json({ error: 'Amount and Invoice ID are required' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: invoiceId,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('[RAZORPAY_ORDER_ERROR]', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}
