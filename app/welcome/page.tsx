"use client";

import { motion } from "framer-motion";
import { agents } from "@/lib/constants";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Confetti from "@/components/ui/Confetti";

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <Confetti />
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-light/10 rounded-full blur-[150px]" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-light to-blue-700 flex items-center justify-center mx-auto mb-8"
        >
          <span className="text-white font-bold text-4xl">A</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome to the <span className="gradient-text">Team!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-foreground-secondary mb-8"
        >
          Your payment was successful. Your AI team is getting ready for you.
        </motion.p>

        {/* Agent avatars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{
                background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                border: `2px solid ${agent.color}`,
              }}
              title={agent.name}
            >
              {agent.emoji}
            </motion.div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <p className="text-foreground-secondary mb-4">Launching in</p>
          <CountdownTimer />
          <p className="text-sm text-foreground-secondary mt-4">March 3rd, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <Link href="/dashboard">
            <Button size="lg">Go to Dashboard</Button>
          </Link>
          <p className="text-sm text-foreground-secondary">
            We&apos;ll notify you when Angi is ready
          </p>
        </motion.div>
      </div>
    </main>
  );
}
