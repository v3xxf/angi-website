"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { pricingTiers, currencySymbols } from "@/lib/constants";
import { agents } from "@/lib/agents-data";
import Button from "../ui/Button";
import Link from "next/link";

type Currency = "USD" | "INR";

const testimonials = [
  { name: "Rahul S.", role: "Startup Founder", text: "Saved 40+ hours/week", avatar: "👨‍💻" },
  { name: "Priya M.", role: "Marketing Lead", text: "10x content output", avatar: "👩‍💼" },
  { name: "Alex K.", role: "Agency Owner", text: "Replaced 3 tools", avatar: "🧑‍💼" },
];

export default function PricingSlider() {
  const [isYearly, setIsYearly] = useState(false);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [countdown, setCountdown] = useState({ hours: 23, mins: 59, secs: 59 });

  // Fake urgency countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, mins: 59, secs: 59 };
        return { hours: 23, mins: 59, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price: number, curr: Currency) => {
    const symbol = currencySymbols[curr];
    if (curr === "INR") {
      return `${symbol}${price.toLocaleString("en-IN")}`;
    }
    return `${symbol}${price}`;
  };

  return (
    <section id="pricing" className="py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 circuit-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-hud-blue/5 to-background" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-hud-cyan rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            CHOOSE YOUR PLAN
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Hire Your <span className="gradient-text">AI Army</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Start with any plan. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        {/* Urgency banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="hud-panel p-4 border-hud-pink/50 bg-hud-pink/5 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="text-hud-pink font-bold animate-pulse">🔥 LAUNCH OFFER</span>
              <span className="text-foreground-secondary">Ends in:</span>
              <div className="flex gap-2 font-hud">
                <span className="px-2 py-1 bg-background rounded text-hud-cyan">
                  {String(countdown.hours).padStart(2, '0')}h
                </span>
                <span className="px-2 py-1 bg-background rounded text-hud-cyan">
                  {String(countdown.mins).padStart(2, '0')}m
                </span>
                <span className="px-2 py-1 bg-background rounded text-hud-cyan">
                  {String(countdown.secs).padStart(2, '0')}s
                </span>
              </div>
              <span className="text-green-400 font-bold">30% OFF</span>
            </div>
          </div>
        </motion.div>

        {/* Currency & Billing toggles */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          {/* Currency toggle */}
          <div className="flex items-center gap-3 hud-panel px-4 py-2">
            <span className="text-sm text-foreground-secondary">Pay in:</span>
            <button
              onClick={() => setCurrency("INR")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                currency === "INR"
                  ? "bg-gradient-to-r from-hud-blue to-hud-cyan text-background shadow-lg shadow-hud-cyan/25"
                  : "text-foreground-secondary hover:text-white"
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                currency === "USD"
                  ? "bg-gradient-to-r from-hud-blue to-hud-cyan text-background shadow-lg shadow-hud-cyan/25"
                  : "text-foreground-secondary hover:text-white"
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center gap-4 hud-panel px-4 py-2">
            <span className={`font-medium ${!isYearly ? "text-hud-cyan" : "text-foreground-secondary"}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-16 h-8 rounded-full bg-background border-2 border-hud-blue/50 transition-colors"
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-hud-blue to-hud-cyan shadow-lg"
                animate={{ left: isYearly ? "calc(100% - 28px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${isYearly ? "text-hud-cyan" : "text-foreground-secondary"}`}>
                Yearly
              </span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                2 MONTHS FREE
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {pricingTiers.map((tier, index) => {
            const price = tier.price[currency];
            const displayPrice = isYearly ? price.yearly : price.monthly;
            const isPopular = tier.popular;
            const isSelected = selectedPlan === tier.id;

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedPlan(tier.id)}
                className={`relative cursor-pointer transition-all duration-300 ${
                  isPopular ? "md:-mt-4 md:mb-4" : ""
                }`}
              >
                {/* Glow effect for popular */}
                {isPopular && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-hud-blue via-hud-cyan to-hud-purple rounded-2xl blur opacity-50 animate-pulse" />
                )}

                <div
                  className={`relative hud-panel p-6 lg:p-8 h-full ${
                    isPopular
                      ? "border-hud-cyan bg-gradient-to-b from-hud-cyan/10 to-transparent"
                      : isSelected
                      ? "border-hud-blue/50"
                      : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-hud-blue to-hud-cyan text-background text-sm font-bold rounded-full shadow-lg shadow-hud-cyan/25">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6 pt-2">
                    <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-foreground-secondary text-sm">{tier.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold gradient-text">
                        {formatPrice(displayPrice, currency)}
                      </span>
                      <span className="text-foreground-secondary text-lg">
                        /{isYearly ? "year" : "mo"}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-foreground-secondary line-through text-sm">
                          {formatPrice(price.monthly * 12, currency)}
                        </span>
                        <span className="text-green-400 font-bold text-sm">
                          Save {formatPrice(price.monthly * 2, currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Agent visual */}
                  <div className="mb-6 p-4 bg-background/50 rounded-xl border border-hud-blue/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-hud text-xs text-hud-cyan tracking-wider">
                        YOUR AGENTS
                      </span>
                      <span className="text-2xl font-bold">{tier.agentCount}</span>
                    </div>
                    <div className="flex -space-x-2">
                      {agents.slice(0, Math.min(tier.agentCount, 6)).map((agent, i) => (
                        <motion.div
                          key={agent.id}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.05 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-background shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${agent.color}80, ${agent.color}40)`,
                          }}
                        >
                          {agent.avatar}
                        </motion.div>
                      ))}
                      {tier.agentCount > 6 && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm bg-hud-purple/50 border-2 border-background font-bold">
                          +{tier.agentCount - 6}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-start gap-3">
                        <span className="text-hud-cyan mt-0.5">✓</span>
                        <span className="text-sm">
                          <span className="text-foreground-secondary">{feature.name}:</span>{" "}
                          <span className="font-medium">{feature.value}</span>
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Link href="/signup" className="block">
                    <Button
                      className={`w-full py-4 text-lg font-bold ${
                        isPopular
                          ? "bg-gradient-to-r from-hud-blue via-hud-cyan to-hud-blue bg-[length:200%_100%] hover:bg-right transition-all duration-500 shadow-lg shadow-hud-cyan/25"
                          : ""
                      }`}
                      variant={isPopular ? "primary" : "secondary"}
                    >
                      🚀 Hire {tier.agentCount} Agents
                    </Button>
                  </Link>

                  {/* Guarantee */}
                  <p className="text-center text-xs text-foreground-secondary mt-4">
                    ✓ Cancel anytime • ✓ Instant access
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="hud-panel p-6 max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <span className="font-hud text-xs text-hud-cyan tracking-wider">
                LOVED BY USERS
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-4 bg-background/50 rounded-xl"
                >
                  <span className="text-3xl mb-2 block">{t.avatar}</span>
                  <p className="font-bold text-hud-cyan mb-1">&quot;{t.text}&quot;</p>
                  <p className="text-sm text-foreground-secondary">{t.name}</p>
                  <p className="text-xs text-foreground-secondary">{t.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-8 text-foreground-secondary">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Secure Payment</p>
                <p className="text-xs">256-bit SSL</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Pay via Razorpay</p>
                <p className="text-xs">UPI, Cards, Net Banking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <div className="text-left">
                <p className="text-sm font-medium text-white">Money Back</p>
                <p className="text-xs">30-day guarantee</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
