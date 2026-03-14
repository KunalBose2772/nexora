import crypto from 'crypto';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(req) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      invoiceId 
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !invoiceId) {
        return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment verified! Update the database.
      await prisma.invoice.update({
        where: { id: invoiceId },
        data: { 
          status: 'Paid',
          paymentMethod: 'Razorpay',
          notes: `Verified Razorpay Payment ID: ${razorpay_payment_id}`
        }
      });

      return NextResponse.json({ ok: true, message: "Payment verified successfully" });
    } else {
      console.warn('[RAZORPAY_INVALID_SIGNATURE]', { sign, expectedSign, signature: razorpay_signature });
      return NextResponse.json({ error: "Invalid signature. Potential tampering detected." }, { status: 400 });
    }
  } catch (error) {
    console.error('[RAZORPAY_VERIFY_ERROR]', error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
