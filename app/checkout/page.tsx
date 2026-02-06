"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { pricingTiers, currencySymbols } from "@/lib/constants";
import { getUser, User } from "@/lib/auth";
import Button from "@/components/ui/Button";

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
  const isYearly = billing === "yearly";

  const plan = pricingTiers.find((t) => t.id === planId) || pricingTiers[1];
  const price = plan.price["INR"];
  const amount = isYearly ? price.yearly : price.monthly;
  const amountInPaise = amount * 100;

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [router]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handlePayment = async () => {
    if (!user) return;

    setProcessing(true);
    setError("");

    try {
      // Create payment link on server
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          plan: plan.id,
          isYearly,
          userId: user.id,
          email: user.email,
          userName: user.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      // Redirect to Razorpay payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
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
      <div className="fixed inset-0 circuit-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-hud-blue/5 via-background to-hud-purple/5" />

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
            <div className="text-center mb-8">
              <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
                CHECKOUT
              </span>
              <h1 className="text-2xl font-bold mb-2">Complete Your Purchase</h1>
              <p className="text-foreground-secondary text-sm">
                You&apos;re about to unlock the {plan.name} plan
              </p>
            </div>

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
                    {formatPrice(amount)}
                  </div>
                  <div className="text-xs text-foreground-secondary">
                    /{isYearly ? "year" : "month"}
                  </div>
                </div>
              </div>

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

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-gradient-to-r from-hud-blue to-hud-cyan hover:shadow-lg hover:shadow-hud-cyan/25 transition-all py-4 text-lg"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Redirecting to payment...
                </span>
              ) : (
                `Pay ${formatPrice(amount)}`
              )}
            </Button>

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

            <div className="mt-6 pt-6 border-t border-hud-blue/20 text-center">
              <p className="text-xs text-foreground-secondary flex items-center justify-center gap-2">
                <span className="text-green-400">🔒</span>
                You&apos;ll be redirected to Razorpay&apos;s secure payment page
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
