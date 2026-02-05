import { NextRequest, NextResponse } from "next/server";
import { verifySignature } from "@/lib/razorpay";
import { updateUserPlan, completePayment } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 }
      );
    }

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      plan,
      userId,
      currency,
    } = await request.json();

    // Verify signature
    const isValid = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Complete the payment record
    const paymentResult = await completePayment(razorpay_order_id, razorpay_payment_id);
    
    if (paymentResult.error) {
      console.error("Failed to complete payment record:", paymentResult.error);
      // Continue anyway as the payment was successful
    }

    // Update user plan
    if (userId && plan) {
      const planType = plan as "free" | "starter" | "pro" | "enterprise";
      const currencyType = currency as "USD" | "INR" | undefined;
      
      const updateResult = await updateUserPlan(userId, planType, currencyType);
      
      if (updateResult.error) {
        console.error("Failed to update user plan:", updateResult.error);
        return NextResponse.json(
          { error: "Failed to update user plan" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      plan,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
