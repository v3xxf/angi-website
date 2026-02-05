"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents } from "@/lib/agents-data";

interface Task {
  id: string;
  title: string;
  target: { x: number; y: number };
  agentId: string;
}

const tasks: Task[] = [
  { id: "t1", title: "Research competitors", target: { x: 80, y: 20 }, agentId: "r1" },
  { id: "t2", title: "Draft email", target: { x: 85, y: 50 }, agentId: "m1" },
  { id: "t3", title: "Schedule meeting", target: { x: 75, y: 70 }, agentId: "o2" },
  { id: "t4", title: "Create report", target: { x: 90, y: 35 }, agentId: "f1" },
];

export default function AgentDeploy() {
  const [deploying, setDeploying] = useState(false);
  const [activeDeployments, setActiveDeployments] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const deployAgents = () => {
    setDeploying(true);
    setActiveDeployments([]);
    setCompletedTasks([]);

    // Stagger deployments
    tasks.forEach((task, i) => {
      setTimeout(() => {
        setActiveDeployments(prev => [...prev, task.id]);
        
        // Complete after flight
        setTimeout(() => {
          setCompletedTasks(prev => [...prev, task.id]);
          
          if (i === tasks.length - 1) {
            setTimeout(() => setDeploying(false), 1000);
          }
        }, 1500);
      }, i * 400);
    });
  };

  const getAgent = (id: string) => agents.find(a => a.id === id);

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
            AGENT DEPLOYMENT
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Watch Them <span className="gradient-text">Fly</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            See your agents deploy to tackle tasks in real-time
          </p>
        </motion.div>

        {/* Deployment visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="hud-panel p-8 relative min-h-[400px]"
        >
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          {/* Command center (left side) */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <motion.div
              className="w-24 h-24 rounded-xl bg-gradient-to-br from-hud-blue/30 to-hud-purple/30 border border-hud-cyan flex items-center justify-center relative"
              animate={{
                boxShadow: deploying
                  ? ["0 0 20px rgba(0, 255, 242, 0.3)", "0 0 40px rgba(0, 255, 242, 0.6)", "0 0 20px rgba(0, 255, 242, 0.3)"]
                  : "0 0 20px rgba(0, 255, 242, 0.3)",
              }}
              transition={{ duration: 1, repeat: deploying ? Infinity : 0 }}
            >
              <span className="text-4xl font-bold gradient-text font-hud">A</span>
              <div className="absolute -bottom-6 text-xs font-hud text-hud-cyan tracking-wider">
                COMMAND
              </div>
            </motion.div>
          </div>

          {/* Task targets (right side) */}
          {tasks.map((task) => {
            const agent = getAgent(task.agentId);
            const isActive = activeDeployments.includes(task.id);
            const isCompleted = completedTasks.includes(task.id);

            return (
              <div
                key={task.id}
                className="absolute"
                style={{ left: `${task.target.x}%`, top: `${task.target.y}%` }}
              >
                {/* Target marker */}
                <motion.div
                  className="w-20 h-20 rounded-lg flex flex-col items-center justify-center"
                  style={{
                    background: isCompleted
                      ? `${agent?.color}20`
                      : "rgba(0, 212, 255, 0.1)",
                    border: `1px solid ${isCompleted ? agent?.color : "rgba(0, 212, 255, 0.3)"}`,
                  }}
                  animate={{
                    boxShadow: isCompleted
                      ? `0 0 20px ${agent?.color}40`
                      : "0 0 10px rgba(0, 212, 255, 0.2)",
                  }}
                >
                  {isCompleted ? (
                    <>
                      <span className="text-xl">{agent?.avatar}</span>
                      <span className="text-[10px] text-white mt-1">{agent?.name}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-foreground-secondary">🎯</span>
                      <span className="text-[10px] text-foreground-secondary mt-1 text-center px-1">
                        {task.title}
                      </span>
                    </>
                  )}
                </motion.div>

                {/* Success ring */}
                {isCompleted && (
                  <motion.div
                    className="absolute inset-0 rounded-lg border-2"
                    style={{ borderColor: agent?.color }}
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            );
          })}

          {/* Flying agents */}
          <AnimatePresence>
            {tasks.map((task) => {
              const agent = getAgent(task.agentId);
              const isActive = activeDeployments.includes(task.id);
              const isCompleted = completedTasks.includes(task.id);

              if (!isActive || isCompleted) return null;

              return (
                <motion.div
                  key={`deploy-${task.id}`}
                  className="absolute z-20"
                  initial={{ left: "15%", top: "50%", scale: 1 }}
                  animate={{
                    left: `${task.target.x}%`,
                    top: `${task.target.y}%`,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  {/* Agent icon */}
                  <motion.div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg relative"
                    style={{
                      background: `linear-gradient(135deg, ${agent?.color}80, ${agent?.color}40)`,
                      border: `2px solid ${agent?.color}`,
                      boxShadow: `0 0 20px ${agent?.color}`,
                    }}
                  >
                    {agent?.avatar}
                    
                    {/* Trail effect */}
                    <motion.div
                      className="absolute right-full h-1 rounded-l-full"
                      style={{
                        background: `linear-gradient(to left, ${agent?.color}, transparent)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: 100 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {tasks.map((task) => {
              const isActive = activeDeployments.includes(task.id);
              const agent = getAgent(task.agentId);
              
              return (
                <motion.line
                  key={`line-${task.id}`}
                  x1="15%"
                  y1="50%"
                  x2={`${task.target.x}%`}
                  y2={`${task.target.y}%`}
                  stroke={isActive ? agent?.color : "rgba(0, 212, 255, 0.1)"}
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? "0" : "5 5"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              );
            })}
          </svg>

          {/* Deploy button */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <motion.button
              onClick={deployAgents}
              disabled={deploying}
              className="px-8 py-3 bg-hud-cyan text-background font-bold rounded-lg font-hud tracking-wider disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {deploying ? "DEPLOYING..." : "🚀 DEPLOY AGENTS"}
            </motion.button>
          </div>

          {/* Status panel */}
          <div className="absolute top-4 left-4 hud-panel px-4 py-2">
            <div className="font-hud text-xs text-hud-cyan tracking-wider">
              MISSION STATUS
            </div>
            <div className="text-sm text-white mt-1">
              {completedTasks.length} / {tasks.length} Complete
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
