"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { pricingTiers, currencySymbols } from "@/lib/constants";
import { agents } from "@/lib/agents-data";
import { getUser, updateUserPlan, User } from "@/lib/auth";
import Button from "@/components/ui/Button";
import "@/lib/razorpay-types";
import type { RazorpayResponse } from "@/lib/razorpay-types";

type Currency = "USD" | "INR";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const planId = searchParams.get("plan") || "pro";
  const billing = searchParams.get("billing") || "monthly";
  const currencyParam = searchParams.get("currency") || "INR";
  const currency = (currencyParam === "USD" ? "USD" : "INR") as Currency;
  const isYearly = billing === "yearly";

  const plan = pricingTiers.find((t) => t.id === planId) || pricingTiers[1];
  const price = plan.price[currency];
  const amount = isYearly ? price.yearly : price.monthly;

  // Amount in smallest currency unit (paise for INR, cents for USD)
  const amountInSmallestUnit = currency === "INR" ? amount * 100 : amount * 100;

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setLoading(false);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [router]);

  const formatPrice = (price: number, curr: Currency) => {
    const symbol = currencySymbols[curr];
    if (curr === "INR") {
      return `${symbol}${price.toLocaleString("en-IN")}`;
    }
    return `${symbol}${price}`;
  };

  const handlePayment = async () => {
    if (!user) return;

    setProcessing(true);
    setError("");

    try {
      // Create order on server
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInSmallestUnit,
          currency,
          plan: plan.id,
          isYearly,
          userId: user.id,
          email: user.email,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amountInSmallestUnit,
        currency,
        name: "Angi Deck",
        description: `${plan.name} Plan - ${isYearly ? "Yearly" : "Monthly"}`,
        order_id: orderData.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#00d4ff",
        },
        handler: async function (response: RazorpayResponse) {
          // Verify payment on server
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan.id,
                userId: user.id,
                currency,
                amount,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              // Update local user plan
              await updateUserPlan(plan.id as "free" | "starter" | "pro" | "enterprise", currency);
              
              // Redirect to success
              router.push("/dashboard?payment=success");
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch {
            setError("Payment verification failed. Please contact support.");
          }
          setProcessing(false);
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-hud-cyan/30 border-t-hud-cyan rounded-full animate-spin" />
          <span className="text-foreground-secondary font-hud">LOADING...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 circuit-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-hud-blue/5 via-background to-hud-purple/5" />

      {/* Back button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-foreground-secondary hover:text-hud-cyan transition-colors"
        >
          <span>←</span>
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <div className="hud-panel p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
                CHECKOUT
              </span>
              <h1 className="text-2xl font-bold mb-2">
                Complete Your Purchase
              </h1>
              <p className="text-foreground-secondary text-sm">
                You&apos;re about to unlock the {plan.name} plan
              </p>
            </div>

            {/* Plan summary */}
            <div className="bg-background/50 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{plan.name} Plan</h3>
                  <p className="text-sm text-foreground-secondary">
                    {isYearly ? "Yearly" : "Monthly"} billing
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold gradient-text">
                    {formatPrice(amount, currency)}
                  </div>
                  <div className="text-xs text-foreground-secondary">
                    /{isYearly ? "year" : "month"}
                  </div>
                </div>
              </div>

              {/* Agents included */}
              <div className="border-t border-hud-blue/20 pt-4">
                <p className="text-sm text-foreground-secondary mb-2">
                  {plan.agentCount} agents included:
                </p>
                <div className="flex -space-x-2">
                  {agents.slice(0, Math.min(plan.agentCount, 6)).map((agent) => (
                    <div
                      key={agent.id}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-background"
                      style={{
                        background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                      }}
                    >
                      {agent.avatar}
                    </div>
                  ))}
                  {plan.agentCount > 6 && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-hud-purple/30 border-2 border-background">
                      +{plan.agentCount - 6}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-hud-blue/20 pt-4 mt-4">
                <ul className="space-y-2">
                  {plan.features.slice(0, 4).map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <span className="text-hud-cyan">✓</span>
                      <span className="text-foreground-secondary">{feature.name}:</span>
                      <span>{feature.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Pay button */}
            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-hud-blue to-hud-cyan hover:shadow-lg hover:shadow-hud-cyan/25 transition-all py-4 text-lg"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                `Pay ${formatPrice(amount, currency)}`
              )}
            </Button>

            {/* Payment methods */}
            <div className="mt-6 text-center">
              <p className="text-xs text-foreground-secondary mb-3">
                Secure payment powered by Razorpay
              </p>
              <div className="flex items-center justify-center gap-4 text-foreground-secondary">
                <span className="text-xs">💳 Cards</span>
                <span className="text-xs">🏦 Net Banking</span>
                <span className="text-xs">📱 UPI</span>
                <span className="text-xs">💰 Wallets</span>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-6 pt-6 border-t border-hud-blue/20 text-center">
              <p className="text-xs text-foreground-secondary flex items-center justify-center gap-2">
                <span className="text-green-400">🔒</span>
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-hud-cyan/30 border-t-hud-cyan rounded-full animate-spin" />
            <span className="text-foreground-secondary font-hud">LOADING...</span>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
