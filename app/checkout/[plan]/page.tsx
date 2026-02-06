"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { pricingTiers, currencySymbols } from "@/lib/constants";
import { getUser, updateUserPlan, User } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Link from "next/link";
import "@/lib/razorpay-types";
import type { RazorpayResponse } from "@/lib/razorpay-types";

type Currency = "USD" | "INR";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = params.plan as string;
  
  const [user, setUser] = useState<User | null>(null);
  const [isYearly, setIsYearly] = useState(searchParams.get("billing") === "yearly");
  const [currency, setCurrency] = useState<Currency>((searchParams.get("currency") as Currency) || "INR");
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const tier = pricingTiers.find((t) => t.id === planId);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

  const price = tier.price[currency];
  const amount = isYearly ? price.yearly : price.monthly;
  const amountInSmallestUnit = amount * 100;

  const handlePayment = async () => {
    if (!scriptLoaded || !user) {
      alert("Payment system is loading. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInSmallestUnit,
          currency,
          plan: planId,
          isYearly,
          userId: user.id,
          email: user.email,
        }),
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || "Failed to create order");
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_Rknvjra18CvozT";
      console.log("Using Razorpay key:", razorpayKey);
      
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: "INR", // Force INR for now
        name: "Angi Deck",
        description: `${tier.name} Plan - ${isYearly ? "Yearly" : "Monthly"}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyResponse = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: planId,
                userId: user.id,
                currency,
              }),
            });

            if (verifyResponse.ok) {
              await updateUserPlan(planId as "starter" | "pro" | "enterprise", currency);
              router.push("/dashboard?payment=success");
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch {
            alert("Payment verification failed. Please contact support.");
          }
          setLoading(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#00d4ff",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
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

          <h1 className="text-2xl font-bold mb-2 gradient-text">Complete Your Purchase</h1>
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
                  {currencySymbols[currency]}{isYearly ? Math.round(amount / 12) : amount}
                </div>
                <div className="text-sm text-foreground-secondary">/month</div>
              </div>
            </div>

            {/* Currency toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-hud-cyan/20 mb-4">
              <span className="text-sm">Currency</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    currency === "INR"
                      ? "bg-hud-cyan text-background"
                      : "text-foreground-secondary hover:text-foreground border border-hud-cyan/30"
                  }`}
                >
                  ₹ INR
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    currency === "USD"
                      ? "bg-hud-cyan text-background"
                      : "text-foreground-secondary hover:text-foreground border border-hud-cyan/30"
                  }`}
                >
                  $ USD
                </button>
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
            <span className="font-bold text-hud-cyan">{currencySymbols[currency]}{amount.toLocaleString()}</span>
          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || !scriptLoaded || !user}
            className="w-full bg-gradient-to-r from-hud-blue to-hud-cyan hover:shadow-lg hover:shadow-hud-cyan/30"
          >
            {loading ? "Processing..." : `Pay ${currencySymbols[currency]}${amount.toLocaleString()}`}
          </Button>

          <p className="mt-4 text-center text-sm text-foreground-secondary">
            🔒 Secure payment powered by Razorpay
          </p>
        </div>
      </motion.div>
    </main>
  );
}
