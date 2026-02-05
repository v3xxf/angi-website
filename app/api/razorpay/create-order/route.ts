import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createPayment } from "@/lib/storage";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency, plan, isYearly, userId, email } = await request.json();

    // Validate currency
    if (!["INR", "USD"].includes(currency)) {
      return NextResponse.json(
        { error: "Invalid currency. Use INR or USD." },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const options = {
      amount: amount, // amount in smallest currency unit (paise/cents)
      currency: currency,
      receipt: `receipt_${plan}_${isYearly ? "yearly" : "monthly"}_${Date.now()}`,
      notes: {
        plan,
        billing: isYearly ? "yearly" : "monthly",
        userId,
        email,
      },
    };

    const order = await razorpay.orders.create(options);

    // Record payment in our storage
    if (userId && email) {
      await createPayment(
        userId,
        email,
        amount / 100, // Convert back to actual amount
        currency as "USD" | "INR",
        plan,
        order.id
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
