"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { pricingTiers, currencySymbols } from "@/lib/constants";
import { getUser, User } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = params.plan as string;

  const [user, setUser] = useState<User | null>(null);
  const [isYearly, setIsYearly] = useState(searchParams.get("billing") === "yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tier = pricingTiers.find((t) => t.id === planId);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  if (!tier || tier.id === "free") {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Plan</h1>
          <Link href="/#pricing">
            <Button>View Pricing</Button>
          </Link>
        </div>
      </main>
    );
  }

  const price = tier.price["INR"];
  const amount = isYearly ? price.yearly : price.monthly;
  const amountInPaise = amount * 100;

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      // Create payment link on server
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          plan: planId,
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
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background relative">
      <div className="absolute inset-0 circuit-bg opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="hud-panel p-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 text-foreground-secondary hover:text-hud-cyan transition-colors"
          >
            ← Back to home
          </Link>

          <h1 className="text-2xl font-bold mb-2 gradient-text">
            Complete Your Purchase
          </h1>
          <p className="text-foreground-secondary mb-8">
            You&apos;re subscribing to the {tier.name} plan
          </p>

          {/* Plan summary */}
          <div className="bg-background/50 border border-hud-cyan/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-hud-cyan">{tier.name} Plan</h3>
                <p className="text-sm text-foreground-secondary">
                  {tier.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currencySymbols["INR"]}{isYearly ? Math.round(amount / 12) : amount}
                </div>
                <div className="text-sm text-foreground-secondary">/month</div>
              </div>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-hud-cyan/20">
              <span className="text-sm">Billing cycle</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !isYearly
                      ? "bg-hud-cyan text-background"
                      : "text-foreground-secondary hover:text-foreground border border-hud-cyan/30"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    isYearly
                      ? "bg-hud-cyan text-background"
                      : "text-foreground-secondary hover:text-foreground border border-hud-cyan/30"
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
            <span className="font-bold text-hud-cyan">
              {currencySymbols["INR"]}{amount.toLocaleString()}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button
            onClick={handlePayment}
            disabled={loading || !user}
            className="w-full bg-gradient-to-r from-hud-blue to-hud-cyan hover:shadow-lg hover:shadow-hud-cyan/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Redirecting to payment...
              </span>
            ) : (
              `Pay ₹${amount.toLocaleString()}`
            )}
          </Button>

          <p className="mt-4 text-center text-sm text-foreground-secondary">
            🔒 You&apos;ll be redirected to Razorpay&apos;s secure payment page
          </p>
        </div>
      </motion.div>
    </main>
  );
}
