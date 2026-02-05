"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { pricingTiers } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import Button from "../ui/Button";
import Link from "next/link";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-32 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent{" "}
            <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto mb-8">
            Start free, upgrade when you&apos;re ready
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={isYearly ? "text-foreground-secondary" : "text-foreground"}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full bg-background-card border border-border transition-colors"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-accent-light"
                animate={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={isYearly ? "text-foreground" : "text-foreground-secondary"}>
              Yearly{" "}
              <span className="text-accent-light text-sm">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-background-card border rounded-2xl p-6 ${
                tier.popular
                  ? "border-accent-light scale-105 shadow-lg shadow-accent-light/10"
                  : "border-border"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent-light text-white text-xs font-medium">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <p className="text-sm text-foreground-secondary mb-4">
                {tier.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold">
                  {formatPrice(isYearly ? tier.price.yearly / 12 : tier.price.monthly)}
                </span>
                <span className="text-foreground-secondary">/month</span>
                {isYearly && tier.price.yearly > 0 && (
                  <div className="text-sm text-foreground-secondary">
                    Billed {formatPrice(tier.price.yearly)}/year
                  </div>
                )}
              </div>

              <Link href={tier.id === "free" ? "/signup" : `/checkout/${tier.id}`}>
                <Button
                  variant={tier.popular ? "primary" : "secondary"}
                  className="w-full mb-6"
                >
                  {tier.cta}
                </Button>
              </Link>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature.name}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="text-accent-light mt-0.5">✓</span>
                    <span>
                      <span className="text-foreground-secondary">
                        {feature.name}:{" "}
                      </span>
                      <span className="text-foreground">{feature.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
