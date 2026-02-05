"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import TypingTerminal from "../ui/TypingTerminal";
import { LiveStatsCounter } from "../ui/StatsCounter";
import Button from "../ui/Button";
import Link from "next/link";
import { totalAgents, totalTasksCompleted } from "@/lib/agents-data";

// Dynamic import for 3D to avoid SSR issues
const ParticleNetwork = dynamic(() => import("../3d/ParticleNetwork"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-background" />,
});

export default function HeroWarRoom() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <ParticleNetwork />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 pointer-events-none" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light/10 border border-accent-light/20 text-accent-light text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {totalAgents}+ agents online
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Your AI
              <br />
              <span className="gradient-text">Workforce</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-foreground-secondary mb-8 max-w-lg"
            >
              {totalAgents}+ specialized AI agents ready to work. Marketing, finance, research, engineering — hire the team you need, instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link href="#marketplace">
                <Button size="lg">
                  Browse Agents
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="secondary" size="lg">
                  Try Demo
                </Button>
              </Link>
            </motion.div>

            {/* Live stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8"
            >
              <LiveStatsCounter 
                baseValue={totalTasksCompleted} 
                incrementPerSecond={2.5}
                label="tasks completed" 
              />
              <div className="w-px bg-border" />
              <LiveStatsCounter 
                baseValue={2847} 
                incrementPerSecond={0.1}
                label="teams using Angi" 
              />
            </motion.div>
          </div>

          {/* Right side - Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <TypingTerminal />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-foreground-secondary">
          <span className="text-sm">Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
