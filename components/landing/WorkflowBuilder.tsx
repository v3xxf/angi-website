"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  type: "trigger" | "agent" | "action" | "output";
  label: string;
  icon: string;
  color: string;
  x: number;
  y: number;
}

const initialNodes: Node[] = [
  { id: "1", type: "trigger", label: "New Email", icon: "📧", color: "#f59e0b", x: 50, y: 150 },
  { id: "2", type: "agent", label: "Maya", icon: "💬", color: "#8b5cf6", x: 250, y: 150 },
  { id: "3", type: "action", label: "Analyze Intent", icon: "🧠", color: "#00d4ff", x: 450, y: 100 },
  { id: "4", type: "action", label: "Draft Response", icon: "✍️", color: "#00d4ff", x: 450, y: 200 },
  { id: "5", type: "output", label: "Send Reply", icon: "✓", color: "#10b981", x: 650, y: 150 },
];

const connections = [
  { from: "1", to: "2" },
  { from: "2", to: "3" },
  { from: "2", to: "4" },
  { from: "3", to: "5" },
  { from: "4", to: "5" },
];

const availableNodes = [
  { type: "trigger", label: "Form Submit", icon: "📝", color: "#f59e0b" },
  { type: "trigger", label: "Schedule", icon: "⏰", color: "#f59e0b" },
  { type: "agent", label: "Nova", icon: "🔍", color: "#10b981" },
  { type: "agent", label: "Kai", icon: "📅", color: "#06b6d4" },
  { type: "action", label: "Send Slack", icon: "💬", color: "#00d4ff" },
  { type: "action", label: "Create Task", icon: "✓", color: "#00d4ff" },
];

export default function WorkflowBuilder() {
  const [nodes] = useState(initialNodes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const runWorkflow = () => {
    setIsAnimating(true);
    
    // Animate through nodes
    const nodeIds = ["1", "2", "3", "4", "5"];
    nodeIds.forEach((id, index) => {
      setTimeout(() => {
        setActiveNode(id);
        if (index === nodeIds.length - 1) {
          setTimeout(() => {
            setActiveNode(null);
            setIsAnimating(false);
          }, 500);
        }
      }, index * 600);
    });
  };

  const getNodePosition = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x + 40, y: node.y + 25 } : { x: 0, y: 0 };
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 circuit-bg opacity-30" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            AUTOMATION ENGINE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Build <span className="gradient-text">Workflows</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Connect triggers, agents, and actions. Automate anything.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Node palette */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="hud-panel p-4">
              <div className="font-hud text-xs text-hud-cyan tracking-wider mb-4">
                COMPONENTS
              </div>
              <div className="space-y-2">
                {availableNodes.map((node, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-hud-blue/20 cursor-grab hover:border-hud-cyan transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-sm"
                      style={{ background: `${node.color}20`, border: `1px solid ${node.color}` }}
                    >
                      {node.icon}
                    </div>
                    <span className="text-sm">{node.label}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-foreground-secondary mt-4">
                Drag to canvas to add
              </p>
            </div>
          </motion.div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <div className="hud-panel p-4 min-h-[400px] relative overflow-hidden">
              {/* Grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
              
              {/* Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, i) => {
                  const from = getNodePosition(conn.from);
                  const to = getNodePosition(conn.to);
                  const isActive = activeNode === conn.from || activeNode === conn.to;
                  
                  return (
                    <g key={i}>
                      <motion.path
                        d={`M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}`}
                        fill="none"
                        stroke={isActive ? "#00fff2" : "rgba(0, 212, 255, 0.3)"}
                        strokeWidth={isActive ? 3 : 2}
                        strokeDasharray={isActive ? "0" : "5 5"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      />
                      {isActive && (
                        <motion.circle
                          r={4}
                          fill="#00fff2"
                          initial={{ offsetDistance: "0%" }}
                          animate={{ offsetDistance: "100%" }}
                          transition={{ duration: 0.5 }}
                          style={{
                            offsetPath: `path('M ${from.x} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x} ${to.y}')`,
                          }}
                        >
                          <animate attributeName="opacity" values="1;0" dur="0.5s" />
                        </motion.circle>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node, i) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: activeNode === node.id ? `0 0 30px ${node.color}` : `0 0 10px ${node.color}40`
                  }}
                  transition={{ delay: i * 0.1 }}
                  className="absolute flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                  style={{
                    left: node.x,
                    top: node.y,
                    background: activeNode === node.id ? `${node.color}30` : `${node.color}15`,
                    border: `1px solid ${node.color}`,
                  }}
                >
                  <span className="text-xl">{node.icon}</span>
                  <span className="text-sm font-medium">{node.label}</span>
                </motion.div>
              ))}

              {/* Run button */}
              <div className="absolute bottom-4 right-4">
                <motion.button
                  onClick={runWorkflow}
                  disabled={isAnimating}
                  className="px-6 py-2 bg-hud-blue/20 border border-hud-cyan rounded-lg font-hud text-sm text-hud-cyan tracking-wider hover:bg-hud-blue/30 transition-colors disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isAnimating ? "RUNNING..." : "▶ RUN WORKFLOW"}
                </motion.button>
              </div>

              {/* Labels */}
              <div className="absolute top-4 left-4 flex gap-4">
                {["Trigger", "Agent", "Action", "Output"].map((label, i) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-foreground-secondary">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ background: ["#f59e0b", "#8b5cf6", "#00d4ff", "#10b981"][i] }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
