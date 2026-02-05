"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🧠",
    title: "Proactive Brain",
    description: "Angi Deck doesn't just respond — she anticipates your needs and takes action before you ask.",
  },
  {
    icon: "🔗",
    title: "Deep Integrations",
    description: "Connect email, calendar, WhatsApp, and more. Your agents work where you work.",
  },
  {
    icon: "🎯",
    title: "Context-Aware",
    description: "Unlimited memory means your team never forgets. Every conversation builds on the last.",
  },
  {
    icon: "🗣️",
    title: "Voice & Chat",
    description: "Talk or type — your choice. Natural conversations that feel human, not robotic.",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    description: "Invite your team to share agents. Coordinate work across your organization.",
  },
  {
    icon: "🔒",
    title: "Enterprise Security",
    description: "Bank-level encryption. Your data is never used for training. Full compliance ready.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Scale</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Powerful features designed to multiply your productivity
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-background-card border border-border rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
