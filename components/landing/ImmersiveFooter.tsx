"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { agents } from "@/lib/agents-data";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Demo", href: "/demo" },
    { label: "Use Cases", href: "/use-cases" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Security", href: "/security" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Compare", href: "/compare" },
    { label: "Help Center", href: "/help" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export default function ImmersiveFooter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative pt-32 pb-12 overflow-hidden">
      {/* Cityscape background */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background-secondary to-transparent" />
        
        {/* City buildings (simplified SVG) */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 256">
            {/* Buildings */}
            <rect x="50" y="100" width="40" height="156" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="100" y="80" width="30" height="176" fill="rgba(0, 212, 255, 0.15)" />
            <rect x="150" y="120" width="50" height="136" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="220" y="60" width="35" height="196" fill="rgba(0, 212, 255, 0.2)" />
            <rect x="280" y="90" width="60" height="166" fill="rgba(0, 212, 255, 0.12)" />
            <rect x="360" y="40" width="45" height="216" fill="rgba(0, 212, 255, 0.18)" />
            <rect x="430" y="70" width="55" height="186" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="510" y="100" width="40" height="156" fill="rgba(0, 212, 255, 0.14)" />
            <rect x="580" y="50" width="50" height="206" fill="rgba(0, 212, 255, 0.16)" />
            <rect x="660" y="80" width="35" height="176" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="720" y="110" width="60" height="146" fill="rgba(0, 212, 255, 0.12)" />
            <rect x="800" y="30" width="45" height="226" fill="rgba(0, 212, 255, 0.2)" />
            <rect x="870" y="90" width="55" height="166" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="950" y="60" width="40" height="196" fill="rgba(0, 212, 255, 0.15)" />
            <rect x="1020" y="100" width="50" height="156" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="1090" y="40" width="35" height="216" fill="rgba(0, 212, 255, 0.18)" />
            <rect x="1150" y="80" width="60" height="176" fill="rgba(0, 212, 255, 0.12)" />
            <rect x="1230" y="70" width="45" height="186" fill="rgba(0, 212, 255, 0.14)" />
            <rect x="1300" y="110" width="55" height="146" fill="rgba(0, 212, 255, 0.1)" />
            <rect x="1380" y="50" width="60" height="206" fill="rgba(0, 212, 255, 0.16)" />
            
            {/* Windows (small dots on buildings) */}
            {[...Array(100)].map((_, i) => (
              <rect
                key={i}
                x={50 + (i % 20) * 70 + Math.random() * 30}
                y={50 + Math.random() * 150}
                width="4"
                height="4"
                fill={Math.random() > 0.5 ? "rgba(0, 255, 242, 0.5)" : "rgba(0, 212, 255, 0.3)"}
              />
            ))}
          </svg>
        </div>

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-hud-cyan/30 to-transparent"
          animate={{ y: [0, 300] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Floating agent avatars */}
      <div className="absolute top-20 left-0 right-0 flex justify-center gap-8 pointer-events-none">
        {agents.slice(0, 5).map((agent, i) => (
          <motion.div
            key={agent.id}
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg opacity-30"
            style={{
              background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}10)`,
              border: `1px solid ${agent.color}40`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {agent.avatar}
          </motion.div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Newsletter section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud-panel p-8 mb-16 text-center"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            MISSION BRIEFING
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Join the <span className="gradient-text">Revolution</span>
          </h3>
          <p className="text-foreground-secondary mb-6 max-w-xl mx-auto">
            Be the first to know when Angi Deck launches. Early access, exclusive updates, and special perks.
          </p>
          
          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-hud-cyan"
            >
              <span className="text-2xl">✓</span>
              <span className="font-hud tracking-wider">MISSION ACCEPTED</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@email.com"
                className="flex-1 px-4 py-3 bg-background/50 border border-hud-blue/30 rounded-lg text-white placeholder-foreground-secondary focus:border-hud-cyan focus:outline-none"
                required
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-hud-cyan text-background font-bold rounded-lg font-hud tracking-wider"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ENLIST
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">Angi Deck</span>
            </Link>
            <p className="text-sm text-foreground-secondary mb-3">
              Your AI-powered team of 100+ agents, ready 24/7.
            </p>
            <div className="inline-block px-3 py-1 rounded border border-hud-cyan/30 bg-hud-cyan/5">
              <span className="text-[10px] text-hud-cyan tracking-[0.15em]">PART OF ZENGUARD HEADQUARTERS</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-hud text-xs text-hud-cyan tracking-wider mb-4">PRODUCT</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-foreground-secondary hover:text-hud-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-hud text-xs text-hud-cyan tracking-wider mb-4">COMPANY</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-foreground-secondary hover:text-hud-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-hud text-xs text-hud-cyan tracking-wider mb-4">RESOURCES</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-foreground-secondary hover:text-hud-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-hud text-xs text-hud-cyan tracking-wider mb-4">LEGAL</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-foreground-secondary hover:text-hud-cyan transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-hud-blue/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-foreground-secondary">
            © 2026 Angi Deck. A Zenguard Headquarters Company. All rights reserved.
          </div>
          
          <div className="flex items-center gap-4">
            {/* Social links */}
            {["X", "LinkedIn", "GitHub", "Discord"].map((social) => (
              <Link
                key={social}
                href="#"
                className="w-8 h-8 rounded-lg bg-hud-blue/10 border border-hud-blue/30 flex items-center justify-center text-sm text-foreground-secondary hover:text-hud-cyan hover:border-hud-cyan transition-colors"
              >
                {social[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
