"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents } from "@/lib/agents-data";

const mockTasks = [
  { id: 1, title: "Market research on AI competitors", status: "completed", agent: "Nova" },
  { id: 2, title: "Schedule team standup for Monday", status: "completed", agent: "Kai" },
  { id: 3, title: "Draft press release for launch", status: "in_progress", agent: "Maya" },
  { id: 4, title: "Review Q4 expense reports", status: "in_progress", agent: "Aria" },
  { id: 5, title: "Create social media content calendar", status: "pending", agent: "Sarah" },
];

const mockMessages = [
  { from: "Nova", text: "Research complete. Found 12 key insights on competitor pricing.", time: "2m ago" },
  { from: "Kai", text: "Meeting scheduled for Monday 10 AM. 5 attendees confirmed.", time: "5m ago" },
  { from: "Maya", text: "Working on the press release. Draft will be ready in 15 minutes.", time: "Now" },
];

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<"tasks" | "chat" | "agents">("tasks");
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const statusColors = {
    completed: "bg-green-400",
    in_progress: "bg-hud-cyan",
    pending: "bg-yellow-400",
  };

  return (
    <section className="py-32 bg-background-secondary relative overflow-hidden">
      {/* Scan lines overlay */}
      <div className="absolute inset-0 scan-lines" />
      
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            COMMAND CENTER
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your <span className="gradient-text">Mission Control</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            This is what you get. Click around and explore the actual interface.
          </p>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="hud-panel overflow-hidden"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 p-3 border-b border-hud-blue/20 bg-background/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center">
              <span className="font-hud text-xs text-hud-cyan tracking-wider">ANGI COMMAND CENTER v2.0</span>
            </div>
            <div className="w-12" />
          </div>

          <div className="flex min-h-[500px]">
            {/* Sidebar */}
            <div className="w-64 border-r border-hud-blue/20 p-4 bg-background/30">
              {/* User */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-hud-blue/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center">
                  <span className="text-white font-bold">J</span>
                </div>
                <div>
                  <div className="text-sm font-medium">John Doe</div>
                  <div className="text-xs text-foreground-secondary">Pro Plan</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: "tasks", icon: "◆", label: "Tasks" },
                  { id: "chat", icon: "◇", label: "Chat" },
                  { id: "agents", icon: "○", label: "Agents" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-hud-blue/20 text-hud-cyan"
                        : "text-foreground-secondary hover:bg-hud-blue/10"
                    }`}
                  >
                    <span className="text-hud-cyan">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Quick stats */}
              <div className="mt-8 pt-4 border-t border-hud-blue/20">
                <div className="font-hud text-xs text-hud-cyan tracking-wider mb-3">
                  TODAY&apos;S STATS
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Tasks</span>
                    <span className="text-white">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Messages</span>
                    <span className="text-white">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Active Agents</span>
                    <span className="text-white">7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                {activeTab === "tasks" && (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">Active Tasks</h3>
                      <button className="px-4 py-2 bg-hud-blue/20 border border-hud-blue/40 rounded-lg text-sm text-hud-cyan hover:bg-hud-blue/30 transition-colors">
                        + New Task
                      </button>
                    </div>

                    <div className="space-y-3">
                      {mockTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          onClick={() => setSelectedTask(task.id === selectedTask ? null : task.id)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedTask === task.id
                              ? "bg-hud-blue/10 border-hud-cyan"
                              : "bg-background/50 border-hud-blue/20 hover:border-hud-blue/40"
                          }`}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${statusColors[task.status as keyof typeof statusColors]}`} />
                            <div className="flex-1">
                              <div className="font-medium">{task.title}</div>
                              <div className="text-sm text-foreground-secondary">Assigned to {task.agent}</div>
                            </div>
                            <span className="text-xs text-foreground-secondary capitalize">{task.status.replace("_", " ")}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-xl font-semibold mb-6">Agent Updates</h3>
                    <div className="space-y-4">
                      {mockMessages.map((msg, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-4 p-4 bg-background/50 rounded-lg border border-hud-blue/20"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm">{msg.from[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{msg.from}</span>
                              <span className="text-xs text-foreground-secondary">{msg.time}</span>
                            </div>
                            <p className="text-foreground-secondary">{msg.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "agents" && (
                  <motion.div
                    key="agents"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <h3 className="text-xl font-semibold mb-6">Your Agents</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {agents.slice(0, 6).map((agent) => (
                        <motion.div
                          key={agent.id}
                          className="p-4 bg-background/50 rounded-lg border border-hud-blue/20 hover:border-hud-cyan transition-colors cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                              style={{
                                background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}20)`,
                                border: `1px solid ${agent.color}`,
                              }}
                            >
                              {agent.avatar}
                            </div>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-xs text-foreground-secondary">{agent.role}</div>
                            </div>
                            <div className="ml-auto w-2 h-2 rounded-full bg-green-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-foreground-secondary mb-4">
            This is just a preview. The real thing is even better.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
