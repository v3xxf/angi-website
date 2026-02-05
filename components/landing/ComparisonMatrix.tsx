"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const competitors = [
  { name: "Angi Deck", isUs: true },
  { name: "ChatGPT", isUs: false },
  { name: "Jasper", isUs: false },
  { name: "Others", isUs: false },
];

const features = [
  { name: "Specialized AI Agents", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
  { name: "100+ Agent Team", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
  { name: "Voice Commands", angi: true, chatgpt: true, jasper: false, others: false },
  { name: "Proactive Brain", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
  { name: "Email Integration", angi: true, chatgpt: false, jasper: true, others: false },
  { name: "Calendar Sync", angi: true, chatgpt: false, jasper: false, others: false },
  { name: "WhatsApp/SMS", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
  { name: "Phone Calls", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
  { name: "Unlimited Memory", angi: true, chatgpt: false, jasper: false, others: false },
  { name: "Workflow Builder", angi: true, chatgpt: false, jasper: true, others: false },
  { name: "Team Collaboration", angi: true, chatgpt: true, jasper: true, others: false },
  { name: "Custom Agents", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
  { name: "API Access", angi: true, chatgpt: true, jasper: true, others: false },
  { name: "24/7 Autonomous Work", angi: true, chatgpt: false, jasper: false, others: false, highlight: true },
];

export default function ComparisonMatrix() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  return (
    <section className="py-32 bg-background-secondary relative overflow-hidden">
      <div className="absolute inset-0 scan-lines opacity-30" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            COMPETITIVE ANALYSIS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="gradient-text">Angi Deck</span> Wins
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            See how we stack up against the competition
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud-panel overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Header */}
              <thead>
                <tr className="border-b border-hud-blue/20">
                  <th className="p-4 text-left font-hud text-xs tracking-wider text-foreground-secondary">
                    FEATURE
                  </th>
                  {competitors.map((comp, i) => (
                    <th
                      key={comp.name}
                      className={`p-4 text-center ${comp.isUs ? "bg-hud-blue/10" : ""}`}
                      onMouseEnter={() => setHoveredCol(i)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      <div className={`font-hud text-sm tracking-wider ${comp.isUs ? "text-hud-cyan" : "text-foreground-secondary"}`}>
                        {comp.name}
                      </div>
                      {comp.isUs && (
                        <span className="text-xs text-hud-cyan block mt-1">★ RECOMMENDED</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              
              {/* Body */}
              <tbody>
                {features.map((feature, rowIndex) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: rowIndex * 0.05 }}
                    className={`border-b border-hud-blue/10 ${
                      hoveredRow === rowIndex ? "bg-hud-blue/5" : ""
                    } ${feature.highlight ? "bg-hud-blue/5" : ""}`}
                    onMouseEnter={() => setHoveredRow(rowIndex)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{feature.name}</span>
                        {feature.highlight && (
                          <span className="px-2 py-0.5 text-[10px] rounded bg-hud-purple/20 text-hud-purple border border-hud-purple/30 font-hud tracking-wider">
                            EXCLUSIVE
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Angi */}
                    <td className={`p-4 text-center bg-hud-blue/10 ${hoveredCol === 0 ? "bg-hud-blue/20" : ""}`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: rowIndex * 0.05 + 0.2 }}
                      >
                        {feature.angi ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-hud-cyan/20 text-hud-cyan">
                            ✓
                          </span>
                        ) : (
                          <span className="text-foreground-secondary">—</span>
                        )}
                      </motion.div>
                    </td>
                    
                    {/* ChatGPT */}
                    <td className={`p-4 text-center ${hoveredCol === 1 ? "bg-hud-blue/5" : ""}`}>
                      {feature.chatgpt ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground-secondary/10 text-foreground-secondary">
                          ✓
                        </span>
                      ) : (
                        <span className="text-foreground-secondary">—</span>
                      )}
                    </td>
                    
                    {/* Jasper */}
                    <td className={`p-4 text-center ${hoveredCol === 2 ? "bg-hud-blue/5" : ""}`}>
                      {feature.jasper ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground-secondary/10 text-foreground-secondary">
                          ✓
                        </span>
                      ) : (
                        <span className="text-foreground-secondary">—</span>
                      )}
                    </td>
                    
                    {/* Others */}
                    <td className={`p-4 text-center ${hoveredCol === 3 ? "bg-hud-blue/5" : ""}`}>
                      {feature.others ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground-secondary/10 text-foreground-secondary">
                          ✓
                        </span>
                      ) : (
                        <span className="text-foreground-secondary">—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="p-6 border-t border-hud-blue/20 bg-hud-blue/5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="font-hud text-hud-cyan tracking-wider mb-1">TOTAL FEATURES</div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">14/14</div>
                    <div className="text-xs text-foreground-secondary">Angi Deck</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground-secondary">4/14</div>
                    <div className="text-xs text-foreground-secondary">ChatGPT</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground-secondary">4/14</div>
                    <div className="text-xs text-foreground-secondary">Jasper</div>
                  </div>
                </div>
              </div>
              
              <motion.button
                className="px-6 py-3 bg-hud-cyan text-background font-semibold rounded-lg hover:bg-hud-blue transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started with Angi Deck
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
