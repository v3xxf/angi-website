"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic import for 3D Globe to avoid SSR issues
const Globe = dynamic(() => import("../3d/Globe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-hud-cyan/30 border-t-hud-cyan rounded-full animate-spin" />
        <span className="font-hud text-sm text-foreground-secondary">LOADING GLOBAL DATA...</span>
      </div>
    </div>
  ),
});

const stats = [
  { value: "4,847", label: "Active Users", icon: "👥" },
  { value: "20+", label: "Countries", icon: "🌍" },
  { value: "2.1M", label: "Tasks Done", icon: "✅" },
  { value: "99.9%", label: "Uptime", icon: "⚡" },
];

export default function GlobalUsers() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-hud-blue/5 to-background" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            GLOBAL PRESENCE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted <span className="gradient-text">Worldwide</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Join thousands of users across the globe who are transforming their work with Angi
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="hud-panel p-4 text-center"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-foreground-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 3D Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="hud-panel overflow-hidden"
        >
          <Globe />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-foreground-secondary mb-4">
            Be part of the AI revolution. Join users from{" "}
            <span className="text-hud-cyan font-bold">India</span>,{" "}
            <span className="text-hud-cyan font-bold">USA</span>,{" "}
            <span className="text-hud-cyan font-bold">UK</span>,{" "}
            <span className="text-hud-cyan font-bold">Singapore</span> and more.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
