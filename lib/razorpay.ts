import crypto from "crypto";

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const text = `${orderId}|${paymentId}`;
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest("hex");

  return generated === signature;
}

// Razorpay plan IDs - these should be created in Razorpay dashboard
export const RAZORPAY_PLANS = {
  starter: {
    monthly: process.env.RAZORPAY_STARTER_MONTHLY_PLAN_ID,
    yearly: process.env.RAZORPAY_STARTER_YEARLY_PLAN_ID,
  },
  pro: {
    monthly: process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID,
    yearly: process.env.RAZORPAY_PRO_YEARLY_PLAN_ID,
  },
  enterprise: {
    monthly: process.env.RAZORPAY_ENTERPRISE_MONTHLY_PLAN_ID,
    yearly: process.env.RAZORPAY_ENTERPRISE_YEARLY_PLAN_ID,
  },
};
