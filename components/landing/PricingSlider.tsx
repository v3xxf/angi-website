"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { pricingTiers, currencySymbols } from "@/lib/constants";
import { agents } from "@/lib/agents-data";
import Button from "../ui/Button";
import Link from "next/link";

type Currency = "USD" | "INR";

export default function PricingSlider() {
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState<Currency>("INR");

  const formatPrice = (price: number, curr: Currency) => {
    const symbol = currencySymbols[curr];
    if (curr === "INR") {
      return `${symbol}${price.toLocaleString("en-IN")}`;
    }
    return `${symbol}${price}`;
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 circuit-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-secondary to-background" />

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            PRICING PLANS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Team</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Unlock your AI workforce. Pick the plan that fits your needs.
          </p>
        </motion.div>

        {/* Currency & Billing toggles */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          {/* Currency toggle */}
          <div className="flex items-center gap-3 hud-panel px-4 py-2">
            <span className="text-sm text-foreground-secondary">Currency:</span>
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currency === "INR"
                  ? "bg-hud-cyan text-background"
                  : "text-foreground-secondary hover:text-white"
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currency === "USD"
                  ? "bg-hud-cyan text-background"
                  : "text-foreground-secondary hover:text-white"
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center gap-4">
            <span className={isYearly ? "text-foreground-secondary" : "text-foreground font-medium"}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-background-card border border-hud-blue/30 transition-colors"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-hud-cyan"
                animate={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={isYearly ? "text-foreground font-medium" : "text-foreground-secondary"}>
              Yearly <span className="text-green-400 text-sm">(2 months free)</span>
            </span>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => {
            const price = tier.price[currency];
            const displayPrice = isYearly ? price.yearly : price.monthly;
            const isPopular = tier.popular;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`hud-panel p-6 relative ${
                  isPopular ? "border-hud-cyan bg-hud-cyan/5" : ""
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-hud-cyan text-background text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-foreground-secondary text-sm">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold gradient-text">
                      {formatPrice(displayPrice, currency)}
                    </span>
                    <span className="text-foreground-secondary">/{isYearly ? "year" : "month"}</span>
                  </div>
                  {isYearly && (
                    <p className="text-sm text-green-400 mt-1">
                      Save {formatPrice(price.monthly * 2, currency)}
                    </p>
                  )}
                </div>

                {/* Agent preview */}
                <div className="mb-6 p-3 bg-background/50 rounded-lg">
                  <div className="flex -space-x-2 mb-2">
                    {agents.slice(0, Math.min(tier.agentCount, 7)).map((agent) => (
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
                    {tier.agentCount > 7 && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-hud-purple/30 border-2 border-background">
                        +{tier.agentCount - 7}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-foreground-secondary">
                    {tier.agentCount} agents included
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-2 text-sm">
                      <span className="text-hud-cyan">✓</span>
                      <span className="text-foreground-secondary">{feature.name}:</span>
                      <span className="font-medium">{feature.value}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/checkout?plan=${tier.id}&billing=${isYearly ? "yearly" : "monthly"}&currency=${currency}`}
                >
                  <Button
                    className={`w-full ${isPopular ? "bg-hud-cyan hover:bg-hud-cyan/90" : ""}`}
                    variant={isPopular ? "primary" : "secondary"}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground-secondary text-sm">
            <span className="flex items-center gap-2">
              <span className="text-green-400">🔒</span> Secure Payment
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Cancel Anytime
            </span>
            <span className="flex items-center gap-2">
              <span className="text-green-400">💳</span> Powered by Razorpay
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
