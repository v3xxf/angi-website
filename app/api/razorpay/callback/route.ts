import { NextRequest, NextResponse } from "next/server";
import { updateUserPlan, completePayment } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const appUrl = "https://www.angideck.com";

  try {
    const searchParams = request.nextUrl.searchParams;

    const razorpayPaymentId = searchParams.get("razorpay_payment_id");
    const razorpayPaymentLinkId = searchParams.get("razorpay_payment_link_id");
    const razorpayPaymentLinkStatus = searchParams.get("razorpay_payment_link_status");

    console.log("=== PAYMENT CALLBACK ===");
    console.log("Payment ID:", razorpayPaymentId);
    console.log("Link ID:", razorpayPaymentLinkId);
    console.log("Status:", razorpayPaymentLinkStatus);

    // Check if payment was successful
    if (razorpayPaymentLinkStatus === "paid" && razorpayPaymentId) {
      // Find the payment record by the payment link ID
      if (razorpayPaymentLinkId) {
        const result = await completePayment(razorpayPaymentLinkId, razorpayPaymentId);

        if (result.payment) {
          // Update user plan based on stored payment info
          const planType = result.payment.plan as "free" | "starter" | "pro" | "enterprise";
          const currencyType = (result.payment.currency || "INR") as "USD" | "INR";
          await updateUserPlan(result.payment.userId, planType, currencyType);

          return NextResponse.redirect(`${appUrl}/dashboard?payment=success&plan=${result.payment.plan}`);
        }
      }

      // Fallback: even if we can't find the record, still redirect to success
      // (the payment DID go through on Razorpay's side)
      return NextResponse.redirect(`${appUrl}/dashboard?payment=success`);
    } else {
      return NextResponse.redirect(`${appUrl}/dashboard?payment=failed`);
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(`${appUrl}/dashboard?payment=error`);
  }
}
