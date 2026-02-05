"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { agents } from "@/lib/agents-data";

const useCases = [
  {
    id: "startup",
    title: "Startups & Solo Founders",
    icon: "🚀",
    description: "Scale your impact without scaling your team",
    challenges: [
      "Limited resources and time",
      "Need to move fast",
      "Wearing multiple hats",
    ],
    solution: "Angi becomes your 24/7 team, handling research, content, scheduling, and more while you focus on building.",
    agents: ["r1", "m1", "o1", "s1"],
    metrics: [
      { label: "Hours saved weekly", value: "40+" },
      { label: "Cost vs hiring", value: "1/10th" },
      { label: "Tasks automated", value: "80%" },
    ],
    testimonial: {
      quote: "Angi is like having a team of 10 for the price of one intern.",
      author: "Sarah Chen",
      role: "Founder, TechStartup",
    },
  },
  {
    id: "marketing",
    title: "Marketing Teams",
    icon: "📣",
    description: "Create more content, reach more audiences",
    challenges: [
      "Content demand exceeds capacity",
      "Need for personalization at scale",
      "Analytics overload",
    ],
    solution: "Deploy specialized agents for content creation, social media, email campaigns, and performance analysis.",
    agents: ["m1", "m2", "c1", "d1"],
    metrics: [
      { label: "Content output", value: "5x" },
      { label: "Campaign ROI", value: "+180%" },
      { label: "Time to publish", value: "-70%" },
    ],
    testimonial: {
      quote: "We've tripled our content output without hiring a single person.",
      author: "Marcus Williams",
      role: "CMO, GrowthCo",
    },
  },
  {
    id: "enterprise",
    title: "Enterprise",
    icon: "🏢",
    description: "Transform operations across departments",
    challenges: [
      "Siloed tools and data",
      "Complex approval workflows",
      "Compliance requirements",
    ],
    solution: "Deploy coordinated agent teams across departments with enterprise-grade security and governance.",
    agents: ["f1", "l1", "h1", "o2"],
    metrics: [
      { label: "Process efficiency", value: "+200%" },
      { label: "Cost reduction", value: "60%" },
      { label: "Compliance rate", value: "99.9%" },
    ],
    testimonial: {
      quote: "Angi helped us automate 60% of our back-office operations.",
      author: "Jennifer Park",
      role: "COO, EnterpriseCorp",
    },
  },
  {
    id: "ecommerce",
    title: "E-Commerce",
    icon: "🛒",
    description: "Automate the entire customer journey",
    challenges: [
      "24/7 customer support demand",
      "Product listing management",
      "Inventory and fulfillment",
    ],
    solution: "Customer service agents handle inquiries while operations agents manage listings, inventory, and logistics.",
    agents: ["s1", "m1", "o1", "d1"],
    metrics: [
      { label: "Response time", value: "<30s" },
      { label: "Support coverage", value: "24/7" },
      { label: "Customer satisfaction", value: "95%" },
    ],
    testimonial: {
      quote: "Our customer satisfaction scores have never been higher.",
      author: "Alex Johnson",
      role: "CEO, ShopDirect",
    },
  },
  {
    id: "agency",
    title: "Agencies",
    icon: "🎨",
    description: "Deliver more for your clients",
    challenges: [
      "Client demands scaling faster than team",
      "Multiple projects simultaneously",
      "Tight deadlines",
    ],
    solution: "Assign dedicated agent teams to each client, delivering consistent quality across all accounts.",
    agents: ["c1", "m1", "r1", "d1"],
    metrics: [
      { label: "Client capacity", value: "3x" },
      { label: "Delivery speed", value: "+150%" },
      { label: "Client retention", value: "98%" },
    ],
    testimonial: {
      quote: "We've taken on 50% more clients without burning out our team.",
      author: "David Lee",
      role: "Partner, CreativeAgency",
    },
  },
];

export default function UseCasesPage() {
  const [activeCase, setActiveCase] = useState(useCases[0]);

  const getAgent = (id: string) => agents.find((a) => a.id === id);

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
              USE CASES
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Solutions for <span className="gradient-text">Everyone</span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl">
              Discover how businesses like yours are using Angi to transform their operations.
            </p>
          </motion.div>
        </div>

        {/* Case selector */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-3">
            {useCases.map((uc) => (
              <motion.button
                key={uc.id}
                onClick={() => setActiveCase(uc)}
                className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  activeCase.id === uc.id
                    ? "bg-hud-cyan text-background"
                    : "hud-panel hover:border-hud-cyan/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{uc.icon}</span>
                <span>{uc.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Case content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-6"
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Details */}
              <div className="space-y-6">
                <div className="hud-panel p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{activeCase.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{activeCase.title}</h2>
                      <p className="text-foreground-secondary">{activeCase.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-hud text-xs text-red-400 tracking-wider mb-3">
                      CHALLENGES
                    </h3>
                    <ul className="space-y-2">
                      {activeCase.challenges.map((c) => (
                        <li key={c} className="flex items-center gap-2 text-foreground-secondary">
                          <span className="text-red-400">✕</span> {c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-hud text-xs text-hud-cyan tracking-wider mb-3">
                      THE ANGI SOLUTION
                    </h3>
                    <p className="text-foreground-secondary">{activeCase.solution}</p>
                  </div>
                </div>

                {/* Agents used */}
                <div className="hud-panel p-6">
                  <h3 className="font-hud text-xs text-hud-cyan tracking-wider mb-4">
                    AGENTS DEPLOYED
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {activeCase.agents.map((id) => {
                      const agent = getAgent(id);
                      if (!agent) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{
                            background: `${agent.color}20`,
                            border: `1px solid ${agent.color}40`,
                          }}
                        >
                          <span>{agent.avatar}</span>
                          <span className="text-sm">{agent.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right: Metrics & testimonial */}
              <div className="space-y-6">
                {/* Metrics */}
                <div className="hud-panel p-6">
                  <h3 className="font-hud text-xs text-hud-cyan tracking-wider mb-6">
                    IMPACT METRICS
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {activeCase.metrics.map((metric) => (
                      <div key={metric.label} className="text-center">
                        <div className="text-3xl font-bold gradient-text mb-1">
                          {metric.value}
                        </div>
                        <div className="text-xs text-foreground-secondary">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="hud-panel p-6 border-hud-purple/50 bg-hud-purple/5">
                  <div className="text-4xl text-hud-purple mb-4">&ldquo;</div>
                  <p className="text-lg mb-6 italic">{activeCase.testimonial.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-hud-purple/30 flex items-center justify-center">
                      {activeCase.testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-bold">{activeCase.testimonial.author}</div>
                      <div className="text-sm text-foreground-secondary">
                        {activeCase.testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  className="w-full px-8 py-4 bg-gradient-to-r from-hud-blue to-hud-purple text-white font-bold rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  See How Angi Works for {activeCase.title}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hud-panel p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Don&apos;t see your <span className="gradient-text">use case</span>?
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-xl mx-auto">
              Angi&apos;s 100+ agents can be configured for virtually any business need. Talk to us about your specific requirements.
            </p>
            <motion.button
              className="px-8 py-4 bg-hud-cyan text-background font-bold rounded-lg font-hud tracking-wider"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CONTACT SALES
            </motion.button>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
