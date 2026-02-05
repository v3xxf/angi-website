"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ComparisonMatrix from "@/components/landing/ComparisonMatrix";

const competitorDetails = [
  {
    name: "ChatGPT",
    description: "General-purpose AI assistant for conversation and content generation",
    strengths: ["Large knowledge base", "Natural conversation", "Wide availability"],
    weaknesses: ["No specialized agents", "No persistent memory", "No team coordination"],
    pricing: "Starting at $20/month",
  },
  {
    name: "Jasper",
    description: "AI writing assistant focused on marketing content",
    strengths: ["Marketing templates", "Brand voice", "SEO tools"],
    weaknesses: ["Only content creation", "No research agents", "No automation"],
    pricing: "Starting at $49/month",
  },
  {
    name: "Notion AI",
    description: "AI features integrated into Notion workspace",
    strengths: ["Workspace integration", "Document editing", "Simple interface"],
    weaknesses: ["Limited to Notion", "No multi-agent", "No voice commands"],
    pricing: "Starting at $10/month add-on",
  },
];

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="fixed inset-0 circuit-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-hud-blue/5 via-transparent to-hud-purple/5 pointer-events-none" />

      <div className="relative z-10 pt-24 pb-16">
        {/* Header */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-hud-cyan hover:text-white transition-colors mb-8"
          >
            <span>←</span>
            <span className="font-hud text-sm tracking-wider">BACK TO BASE</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
              COMPETITIVE ANALYSIS
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Angi</span>?
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl">
              See how Angi&apos;s AI agent army compares to single-agent solutions.
            </p>
          </motion.div>
        </div>

        {/* Matrix comparison */}
        <ComparisonMatrix />

        {/* Detailed comparisons */}
        <section className="max-w-6xl mx-auto px-6 mt-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-8 text-center"
          >
            Detailed <span className="gradient-text">Analysis</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {competitorDetails.map((competitor, i) => (
              <motion.div
                key={competitor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="hud-panel p-6"
              >
                <h3 className="text-xl font-bold mb-2">{competitor.name}</h3>
                <p className="text-sm text-foreground-secondary mb-4">
                  {competitor.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-hud text-xs text-green-400 tracking-wider mb-2">
                    STRENGTHS
                  </h4>
                  <ul className="space-y-1">
                    {competitor.strengths.map((s) => (
                      <li key={s} className="text-sm text-foreground-secondary flex items-center gap-2">
                        <span className="text-green-400">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-hud text-xs text-red-400 tracking-wider mb-2">
                    LIMITATIONS
                  </h4>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((w) => (
                      <li key={w} className="text-sm text-foreground-secondary flex items-center gap-2">
                        <span className="text-red-400">−</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-hud-blue/20">
                  <span className="text-xs text-foreground-secondary">PRICING</span>
                  <div className="font-bold">{competitor.pricing}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Angi advantage */}
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hud-panel p-8 border-hud-cyan bg-hud-cyan/5"
          >
            <div className="text-center mb-8">
              <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
                THE ANGI ADVANTAGE
              </span>
              <h3 className="text-2xl md:text-3xl font-bold">
                100+ Specialized Agents Working <span className="gradient-text">Together</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">100+</div>
                <div className="text-sm text-foreground-secondary">Specialized Agents</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-sm text-foreground-secondary">Always Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">1</div>
                <div className="text-sm text-foreground-secondary">Unified Platform</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <motion.button
                className="px-8 py-4 bg-hud-cyan text-background font-bold rounded-lg font-hud tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                START FREE TRIAL
              </motion.button>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
