import { NextRequest, NextResponse } from "next/server";
import { updateUserPlan, completePayment } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const razorpayPaymentId = searchParams.get("razorpay_payment_id");
    const razorpayPaymentLinkId = searchParams.get("razorpay_payment_link_id");
    const razorpayPaymentLinkStatus = searchParams.get("razorpay_payment_link_status");
    const userId = searchParams.get("userId");
    const plan = searchParams.get("plan");
    const currency = searchParams.get("currency") || "INR";

    console.log("=== PAYMENT CALLBACK ===");
    console.log("Payment ID:", razorpayPaymentId);
    console.log("Link ID:", razorpayPaymentLinkId);
    console.log("Status:", razorpayPaymentLinkStatus);
    console.log("User:", userId, "Plan:", plan);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.angideck.com";

    // Check if payment was successful
    if (razorpayPaymentLinkStatus === "paid" && razorpayPaymentId) {
      // Complete the payment record
      if (razorpayPaymentLinkId) {
        await completePayment(razorpayPaymentLinkId, razorpayPaymentId);
      }

      // Update user plan
      if (userId && plan) {
        const planType = plan as "free" | "starter" | "pro" | "enterprise";
        const currencyType = currency as "USD" | "INR";
        await updateUserPlan(userId, planType, currencyType);
      }

      // Redirect to dashboard with success
      return NextResponse.redirect(`${appUrl}/dashboard?payment=success&plan=${plan}`);
    } else {
      // Payment failed or cancelled
      return NextResponse.redirect(`${appUrl}/dashboard?payment=failed`);
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.angideck.com";
    return NextResponse.redirect(`${appUrl}/dashboard?payment=error`);
  }
}
