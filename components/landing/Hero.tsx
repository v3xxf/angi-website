"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import { agents } from "@/lib/constants";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-background to-background" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Floating agents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            className="absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{
              background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
              border: `1px solid ${agent.color}50`,
              left: `${15 + (index % 4) * 20}%`,
              top: `${20 + Math.floor(index / 4) * 40}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          >
            {agent.emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent-light/10 border border-accent-light/20 text-accent-light text-sm font-medium mb-6">
            Launching March 3rd, 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          Your AI Team{" "}
          <span className="gradient-text">Awaits</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-3xl mx-auto"
        >
          7 specialized AI agents working 24/7 for your success. 
          Not just AI — your digital team.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="#agents">
            <Button size="lg">Meet Your Team</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" size="lg">
              Get Early Access
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-foreground-secondary"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">7</div>
            <div className="text-sm">AI Agents</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">24/7</div>
            <div className="text-sm">Availability</div>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">1</div>
            <div className="text-sm">Conversation</div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-foreground-secondary flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-foreground-secondary"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
