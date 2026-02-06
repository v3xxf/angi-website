import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    console.log("=== RAZORPAY CREATE ORDER ===");
    console.log("Key ID exists:", !!keyId, "Length:", keyId?.length);
    console.log("Secret exists:", !!keySecret, "Length:", keySecret?.length);

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials");
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, plan, isYearly, userId, email } = body;

    console.log("Request body:", { amount, plan, isYearly, userId, email });

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Amount should already be in paise from client
    const amountInPaise = Math.round(amount);
    const receipt = `rcpt_${Date.now()}`.substring(0, 40);

    // Create order using direct API call (simpler than SDK)
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    
    const orderPayload = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receipt,
      notes: {
        plan: plan || "unknown",
        billing: isYearly ? "yearly" : "monthly",
        userId: userId || "guest",
        email: email || "unknown",
      },
    };

    console.log("Creating order with payload:", orderPayload);

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify(orderPayload),
    });

    const responseText = await razorpayResponse.text();
    console.log("Razorpay response status:", razorpayResponse.status);
    console.log("Razorpay response:", responseText);

    if (!razorpayResponse.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { description: responseText };
      }
      console.error("Razorpay API error:", errorData);
      return NextResponse.json(
        { 
          error: errorData?.error?.description || "Failed to create payment order",
          details: errorData 
        },
        { status: razorpayResponse.status }
      );
    }

    const order = JSON.parse(responseText);
    console.log("Order created successfully:", order.id);

    // Store payment record
    if (userId && email) {
      await createPayment(
        userId,
        email,
        amountInPaise,
        "INR",
        plan,
        order.id
      );
    }

    return NextResponse.json(order);
  } catch (error: unknown) {
    console.error("Create order error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
