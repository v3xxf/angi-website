"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { pricingTiers } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";
import "@/lib/razorpay-types";
import type { RazorpayResponse } from "@/lib/razorpay-types";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const planId = params.plan as string;
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const tier = pricingTiers.find((t) => t.id === planId);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!tier || tier.id === "free") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan</h1>
          <Link href="/pricing">
            <Button>View Pricing</Button>
          </Link>
        </div>
      </main>
    );
  }

  const price = isYearly ? tier.price.yearly : tier.price.monthly;

  const handlePayment = async () => {
    if (!scriptLoaded) {
      alert("Payment system is loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      // Create order
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price * 100, // Razorpay expects amount in paise/cents
          currency: "USD",
          plan: planId,
          isYearly,
        }),
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || "Failed to create order");
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: "Angi",
        description: `${tier.name} Plan - ${isYearly ? "Yearly" : "Monthly"}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: planId,
            }),
          });

          if (verifyResponse.ok) {
            router.push("/welcome");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="bg-background-card border border-border rounded-2xl p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-foreground-secondary hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>

          <h1 className="text-2xl font-bold mb-2">Complete your purchase</h1>
          <p className="text-foreground-secondary mb-8">
            You&apos;re subscribing to the {tier.name} plan
          </p>

          {/* Plan summary */}
          <div className="bg-background border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{tier.name} Plan</h3>
                <p className="text-sm text-foreground-secondary">
                  {tier.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatPrice(isYearly ? price / 12 : price)}
                </div>
                <div className="text-sm text-foreground-secondary">/month</div>
              </div>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm">Billing cycle</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !isYearly
                      ? "bg-accent-light text-white"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    isYearly
                      ? "bg-accent-light text-white"
                      : "text-foreground-secondary hover:text-foreground"
                  }`}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mb-6 text-lg">
            <span>Total {isYearly ? "per year" : "per month"}</span>
            <span className="font-bold">{formatPrice(price)}</span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !scriptLoaded}
            className="w-full"
          >
            {loading ? "Processing..." : `Pay ${formatPrice(price)}`}
          </Button>

          <p className="mt-4 text-center text-sm text-foreground-secondary">
            Secure payment powered by Razorpay
          </p>
        </div>
      </motion.div>
    </main>
  );
}
