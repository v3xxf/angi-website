"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { totalAgents } from "@/lib/agents-data";

export default function HUDOverlay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [stats, setStats] = useState({
    agentsOnline: totalAgents,
    tasksPerSecond: 47,
    activeUsers: 2847,
    systemLoad: 67,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        tasksPerSecond: Math.floor(40 + Math.random() * 20),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        systemLoad: Math.floor(60 + Math.random() * 20),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.5 }}
      className="fixed top-24 right-4 z-40"
    >
      <motion.div
        className="hud-panel p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-hud text-xs text-hud-cyan tracking-wider">SYSTEM STATUS</span>
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-hud-cyan ml-auto"
          >
            ▼
          </motion.span>
        </div>

        {/* Main stat */}
        <div className="text-center mb-2">
          <div className="font-hud text-3xl text-white">{stats.agentsOnline}</div>
          <div className="text-xs text-foreground-secondary">AGENTS ONLINE</div>
        </div>

        {/* Expanded stats */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 border-t border-hud-blue/20 space-y-3">
                {/* Tasks per second */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">Tasks/sec</span>
                    <span className="font-mono text-hud-cyan">{stats.tasksPerSecond}</span>
                  </div>
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-hud-blue to-hud-cyan"
                      animate={{ width: `${stats.tasksPerSecond}%` }}
                    />
                  </div>
                </div>

                {/* Active users */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">Active Users</span>
                    <span className="font-mono text-hud-cyan">{stats.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-hud-purple to-hud-pink"
                      style={{ width: "78%" }}
                    />
                  </div>
                </div>

                {/* System load */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-foreground-secondary">System Load</span>
                    <span className="font-mono text-hud-cyan">{stats.systemLoad}%</span>
                  </div>
                  <div className="h-1 bg-background rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500"
                      animate={{ width: `${stats.systemLoad}%` }}
                    />
                  </div>
                </div>

                {/* Mini activity feed */}
                <div className="pt-2 border-t border-hud-blue/20">
                  <div className="text-xs text-foreground-secondary mb-2">LIVE ACTIVITY</div>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="text-green-400 animate-pulse">▸ Nova completed research task</div>
                    <div className="text-hud-cyan">▸ Maya processing 3 emails</div>
                    <div className="text-hud-purple">▸ Kai scheduling meeting...</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mini visualization */}
      <div className="mt-2 hud-panel p-2">
        <div className="flex items-center gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-hud-cyan rounded-full"
              animate={{
                height: [4, 12 + Math.random() * 8, 4],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
