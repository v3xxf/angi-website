"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const roadmapItems = [
  {
    quarter: "Q1 2026",
    status: "completed",
    items: [
      { title: "Launch Core Platform", description: "Initial release with 50+ agents", status: "completed" },
      { title: "Voice Command Interface", description: "Natural language processing for commands", status: "completed" },
      { title: "Team Collaboration", description: "Multi-user workspaces and permissions", status: "completed" },
    ],
  },
  {
    quarter: "Q2 2026",
    status: "current",
    items: [
      { title: "Mobile App", description: "iOS and Android native applications", status: "in-progress" },
      { title: "API Integrations Hub", description: "Connect with 500+ third-party services", status: "in-progress" },
      { title: "Custom Agent Builder", description: "Create your own specialized agents", status: "planned" },
    ],
  },
  {
    quarter: "Q3 2026",
    status: "upcoming",
    items: [
      { title: "Enterprise SSO", description: "SAML/OAuth integration for enterprises", status: "planned" },
      { title: "Advanced Analytics", description: "Deep insights into agent performance", status: "planned" },
      { title: "Workflow Marketplace", description: "Share and discover automation templates", status: "planned" },
    ],
  },
  {
    quarter: "Q4 2026",
    status: "upcoming",
    items: [
      { title: "AI Training Studio", description: "Fine-tune agents on your data", status: "planned" },
      { title: "Predictive Automation", description: "Agents that anticipate your needs", status: "planned" },
      { title: "Cross-Org Collaboration", description: "Share agents between organizations", status: "planned" },
    ],
  },
];

const statusColors = {
  completed: { bg: "bg-green-500/20", border: "border-green-500", text: "text-green-400" },
  "in-progress": { bg: "bg-hud-cyan/20", border: "border-hud-cyan", text: "text-hud-cyan" },
  planned: { bg: "bg-hud-purple/20", border: "border-hud-purple/50", text: "text-hud-purple" },
};

export default function RoadmapPage() {
  const [_selectedQuarter, _setSelectedQuarter] = useState<string | null>(null);

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
              DEVELOPMENT TIMELINE
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Product <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl">
              See what we&apos;re building and where Angi is headed.
            </p>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-foreground-secondary">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-hud-cyan" />
              <span className="text-sm text-foreground-secondary">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-hud-purple" />
              <span className="text-sm text-foreground-secondary">Planned</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-hud-cyan via-hud-blue to-hud-purple" />

            {roadmapItems.map((quarter, i) => (
              <motion.div
                key={quarter.quarter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative mb-12 ${i % 2 === 0 ? "md:pr-[52%]" : "md:pl-[52%]"}`}
              >
                {/* Quarter indicator */}
                <div
                  className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center ${
                    quarter.status === "current"
                      ? "bg-hud-cyan animate-pulse-glow"
                      : quarter.status === "completed"
                      ? "bg-green-500"
                      : "bg-hud-purple/50"
                  }`}
                >
                  {quarter.status === "completed" ? "✓" : quarter.status === "current" ? "●" : "○"}
                </div>

                {/* Content card */}
                <div className={`ml-12 md:ml-0 hud-panel p-6 ${quarter.status === "current" ? "border-hud-cyan" : ""}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold font-hud">{quarter.quarter}</h3>
                    <span
                      className={`text-xs font-hud tracking-wider px-3 py-1 rounded-full ${
                        statusColors[quarter.status as keyof typeof statusColors]?.bg
                      } ${statusColors[quarter.status as keyof typeof statusColors]?.text}`}
                    >
                      {quarter.status === "current" ? "NOW" : quarter.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {quarter.items.map((item) => (
                      <motion.div
                        key={item.title}
                        className={`p-4 rounded-lg ${statusColors[item.status as keyof typeof statusColors]?.bg} border ${
                          statusColors[item.status as keyof typeof statusColors]?.border
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold mb-1">{item.title}</h4>
                            <p className="text-sm text-foreground-secondary">{item.description}</p>
                          </div>
                          <span
                            className={`text-xs font-hud ${
                              statusColors[item.status as keyof typeof statusColors]?.text
                            }`}
                          >
                            {item.status === "in-progress" ? "🔄" : item.status === "completed" ? "✓" : "○"}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature request */}
        <section className="max-w-4xl mx-auto px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hud-panel p-8 text-center"
          >
            <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
              HAVE AN IDEA?
            </span>
            <h3 className="text-2xl font-bold mb-4">
              Shape the <span className="gradient-text">Future</span>
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-xl mx-auto">
              We build Angi based on your feedback. Tell us what features you&apos;d love to see.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-hud-blue to-hud-purple text-white font-bold rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Submit Feature Request
            </motion.button>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
