import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createPayment } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      console.error("Razorpay keys missing:", { hasKeyId: !!keyId, hasKeySecret: !!keySecret });
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const body = await request.json();
    const { amount, currency, plan, isYearly, userId, email } = body;

    console.log("Creating order with:", { amount, currency, plan, isYearly, userId, email });

    // Validate inputs
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Validate currency
    if (!["INR", "USD"].includes(currency)) {
      return NextResponse.json(
        { error: "Invalid currency. Use INR or USD." },
        { status: 400 }
      );
    }

    // Razorpay requires amount in smallest currency unit (paise for INR, cents for USD)
    // Make sure amount is an integer
    const amountInSmallestUnit = Math.round(amount);

    // Create Razorpay order
    const options = {
      amount: amountInSmallestUnit,
      currency: currency,
      receipt: `rcpt_${plan}_${Date.now()}`.substring(0, 40), // Receipt max 40 chars
      notes: {
        plan: plan || "unknown",
        billing: isYearly ? "yearly" : "monthly",
        userId: userId || "guest",
        email: email || "unknown",
      },
    };

    console.log("Razorpay order options:", options);

    const order = await razorpay.orders.create(options);
    
    console.log("Order created successfully:", order.id);

    // Record payment in our storage
    if (userId && email) {
      await createPayment(
        userId,
        email,
        amountInSmallestUnit, // Store in smallest unit
        currency as "USD" | "INR",
        plan,
        order.id
      );
    }

    return NextResponse.json(order);
  } catch (error: unknown) {
    const err = error as { error?: { description?: string }; message?: string; statusCode?: number };
    console.error("Error creating Razorpay order:", {
      message: err?.message || "Unknown error",
      description: err?.error?.description,
      statusCode: err?.statusCode,
      fullError: JSON.stringify(error),
    });
    
    // Return more specific error message
    const errorMessage = err?.error?.description || err?.message || "Failed to create order";
    return NextResponse.json(
      { error: errorMessage },
      { status: err?.statusCode || 500 }
    );
  }
}
