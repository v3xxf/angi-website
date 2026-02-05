"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Tell Angi Deck what you need",
    description: "Just chat naturally. Explain what you're working on, what you need help with, or what's on your mind.",
  },
  {
    number: "02",
    title: "She assigns the right agent",
    description: "Angi Deck understands your request and routes it to the perfect specialist — or handles it herself.",
  },
  {
    number: "03",
    title: "Work gets done while you focus",
    description: "Your agents work in the background, updating you when tasks are complete or need your input.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Getting started is as simple as having a conversation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-accent-light to-transparent" />
              )}

              <div className="relative bg-background-card border border-border rounded-2xl p-8">
                <span className="text-6xl font-bold text-accent-light/20 absolute top-4 right-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-semibold mb-3 relative">
                  {step.title}
                </h3>
                <p className="text-foreground-secondary relative">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
