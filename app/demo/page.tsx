"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import VoiceCommand from "@/components/landing/VoiceCommand";
import CommandCenter from "@/components/landing/CommandCenter";
import WorkflowBuilder from "@/components/landing/WorkflowBuilder";
import AgentDeploy from "@/components/landing/AgentDeploy";

const demos = [
  { id: "voice", title: "Voice Command", icon: "🎙️", description: "Talk to Angi using natural language" },
  { id: "dashboard", title: "Command Center", icon: "📊", description: "Explore the mission control dashboard" },
  { id: "workflow", title: "Workflow Builder", icon: "🔄", description: "Build automated agent pipelines" },
  { id: "deploy", title: "Agent Deploy", icon: "🚀", description: "Watch agents fly to tasks" },
];

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState("voice");

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
              INTERACTIVE DEMOS
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Experience <span className="gradient-text">Angi</span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl">
              Explore Angi&apos;s capabilities through interactive demos. No signup required.
            </p>
          </motion.div>
        </div>

        {/* Demo selector */}
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap gap-4">
            {demos.map((demo) => (
              <motion.button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`hud-panel px-6 py-4 flex items-center gap-4 transition-all ${
                  activeDemo === demo.id
                    ? "border-hud-cyan bg-hud-cyan/10"
                    : "hover:border-hud-blue/50"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">{demo.icon}</span>
                <div className="text-left">
                  <div className="font-bold">{demo.title}</div>
                  <div className="text-xs text-foreground-secondary">{demo.description}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Demo content */}
        <motion.div
          key={activeDemo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeDemo === "voice" && <VoiceCommand />}
          {activeDemo === "dashboard" && <CommandCenter />}
          {activeDemo === "workflow" && <WorkflowBuilder />}
          {activeDemo === "deploy" && <AgentDeploy />}
        </motion.div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-6 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hud-panel p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h3>
            <p className="text-foreground-secondary mb-6 max-w-xl mx-auto">
              Join thousands of businesses using Angi to automate their workflows.
            </p>
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-hud-blue to-hud-purple text-white font-bold rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
