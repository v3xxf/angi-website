"use client";

import { motion } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";
import { agents } from "@/lib/agents-data";
import Link from "next/link";

const features = [
  { icon: "🤖", title: "100+ AI Agents", desc: "Specialized for every task" },
  { icon: "⚡", title: "24/7 Availability", desc: "Always ready to help" },
  { icon: "🔗", title: "Integrations", desc: "Email, Calendar, WhatsApp" },
  { icon: "🧠", title: "Smart Memory", desc: "Learns your preferences" },
];

export default function SignupPage() {
  // Get 8 random featured agents for display
  const featuredAgents = agents.filter(a => a.featured).slice(0, 8);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 circuit-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-hud-blue/10 via-background to-hud-purple/10" />
      
      {/* Animated scan line */}
      <motion.div
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-hud-cyan/50 to-transparent"
        animate={{ y: [0, 1000] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Back to home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground-secondary hover:text-hud-cyan transition-colors"
        >
          <span>←</span>
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
              YOUR AI WORKFORCE AWAITS
            </span>
            <h1 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Meet Your New{" "}
              <span className="gradient-text">AI Team</span>
            </h1>
            <p className="text-xl text-foreground-secondary mb-8 max-w-lg">
              Join thousands using Angi Deck to supercharge their productivity with 100+ specialized AI agents.
            </p>
            <div className="inline-block px-3 py-1 rounded border border-hud-cyan/30 bg-hud-cyan/5 mb-8">
              <span className="text-[10px] text-hud-cyan tracking-[0.15em]">PART OF ZENGUARD HEADQUARTERS</span>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="hud-panel p-4"
                >
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-sm text-foreground-secondary">{feature.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Agent preview */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-sm text-foreground-secondary mb-3">
                Your team includes:
              </p>
              <div className="flex -space-x-3">
                {featuredAgents.map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 border-background"
                    style={{
                      background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                    }}
                    title={agent.name}
                  >
                    {agent.avatar}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm bg-hud-purple/30 border-2 border-background font-bold"
                >
                  +108
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex flex-col items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold gradient-text">Angi Deck</span>
                <span className="text-[9px] text-hud-cyan/70 tracking-[0.15em]">PART OF ZENGUARD HEADQUARTERS</span>
              </Link>
              <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
              <p className="text-foreground-secondary text-sm">
                Join thousands using Angi Deck
              </p>
            </div>

            <AuthForm mode="signup" />

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-foreground-secondary"
            >
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> No credit card required
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> Free to sign up
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> Cancel anytime
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
