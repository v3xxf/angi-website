import { NextRequest, NextResponse } from "next/server";
import { createPayment } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID?.trim();
    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();

    console.log("=== RAZORPAY PAYMENT LINK ===");
    console.log("Key ID:", keyId ? keyId.substring(0, 12) + "..." : "MISSING");
    console.log("Secret:", keySecret ? "SET (" + keySecret.length + " chars)" : "MISSING");

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact support." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, plan, isYearly, userId, email, userName } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Amount in paise
    const amountInPaise = Math.round(amount);

    // Get the base URL for callback
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.angideck.com";

    // Create payment link via Razorpay API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const paymentLinkPayload = {
      amount: amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: `Angi Deck - ${plan} Plan (${isYearly ? "Yearly" : "Monthly"})`,
      customer: {
        name: userName || "Customer",
        email: email || "",
      },
      notify: {
        sms: false,
        email: true,
      },
      reminder_enable: false,
      notes: {
        plan: plan || "unknown",
        billing: isYearly ? "yearly" : "monthly",
        userId: userId || "guest",
      },
      callback_url: `${appUrl}/api/razorpay/callback?userId=${userId}&plan=${plan}&currency=INR`,
      callback_method: "get",
    };

    console.log("Creating payment link:", JSON.stringify(paymentLinkPayload, null, 2));

    const response = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(paymentLinkPayload),
    });

    const responseText = await response.text();
    console.log("Razorpay response status:", response.status);
    console.log("Razorpay response:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { description: responseText };
      }
      console.error("Razorpay API error:", errorData);
      return NextResponse.json(
        {
          error: errorData?.error?.description || "Failed to create payment link",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const paymentLink = JSON.parse(responseText);
    console.log("Payment link created:", paymentLink.short_url);

    // Store payment record
    if (userId && email) {
      await createPayment(
        userId,
        email,
        amountInPaise,
        "INR",
        plan,
        paymentLink.id
      );
    }

    return NextResponse.json({
      paymentUrl: paymentLink.short_url,
      paymentLinkId: paymentLink.id,
    });
  } catch (error: unknown) {
    console.error("Create payment link error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err?.message || "Failed to create payment link" },
      { status: 500 }
    );
  }
}
