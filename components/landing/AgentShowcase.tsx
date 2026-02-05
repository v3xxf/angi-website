"use client";

import { motion } from "framer-motion";
import { agents } from "@/lib/constants";
import { useState } from "react";

export default function AgentShowcase() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);

  return (
    <section id="agents" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Your <span className="gradient-text">Team</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Each agent is specialized in their domain, working together to handle everything you throw at them.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Agent circle */}
          <div className="relative aspect-square max-w-lg mx-auto">
            {/* Center logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-accent-light to-blue-700 flex items-center justify-center z-10">
              <span className="text-4xl font-bold text-white">A</span>
            </div>

            {/* Orbiting agents */}
            {agents.map((agent, index) => {
              const angle = (index / agents.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 45; // percentage
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);

              return (
                <motion.button
                  key={agent.id}
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    selectedAgent.id === agent.id
                      ? "ring-2 ring-offset-2 ring-offset-background scale-125"
                      : "hover:scale-110"
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                    border: `2px solid ${agent.color}`,
                    boxShadow: selectedAgent.id === agent.id ? `0 0 0 2px ${agent.color}` : "none",
                  }}
                  onClick={() => setSelectedAgent(agent)}
                  whileHover={{ scale: selectedAgent.id === agent.id ? 1.25 : 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {agent.emoji}
                </motion.button>
              );
            })}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="rgba(37, 99, 235, 0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>
          </div>

          {/* Agent details */}
          <motion.div
            key={selectedAgent.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background-card border border-border rounded-2xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${selectedAgent.color}60, ${selectedAgent.color}30)`,
                  border: `2px solid ${selectedAgent.color}`,
                }}
              >
                {selectedAgent.emoji}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{selectedAgent.name}</h3>
                <p className="text-foreground-secondary">{selectedAgent.role}</p>
              </div>
            </div>

            <p className="text-lg text-foreground-secondary mb-6">
              {selectedAgent.description}
            </p>

            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 rounded-full bg-white/5 text-foreground-secondary">
                {selectedAgent.personality}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
