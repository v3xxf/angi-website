"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, agentCategories, searchAgents, getAgentsByCategory, type Agent } from "@/lib/agents-data";
import Button from "../ui/Button";
import Link from "next/link";

export default function AgentMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const filteredAgents = useMemo(() => {
    let result = agents;
    
    if (searchQuery) {
      result = searchAgents(searchQuery);
    } else if (selectedCategory) {
      result = getAgentsByCategory(selectedCategory);
    }
    
    return result.slice(0, 24); // Limit for performance
  }, [selectedCategory, searchQuery]);

  return (
    <section id="marketplace" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-hud-purple/5 to-background" />
      <div className="absolute inset-0 circuit-bg opacity-20" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            AGENT MARKETPLACE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet Your <span className="gradient-text">AI Team</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Browse {agents.length}+ specialized agents. Hire the perfect team for any task.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-hud-cyan"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search agents... (e.g., 'SEO', 'bookkeeper', 'email')"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCategory(null);
              }}
              className="w-full pl-12 pr-4 py-4 bg-background/50 border border-hud-blue/30 rounded-full text-lg focus:outline-none focus:border-hud-cyan focus:shadow-[0_0_20px_rgba(0,255,242,0.2)] transition-all"
            />
          </div>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory && !searchQuery
                ? "bg-gradient-to-r from-hud-blue to-hud-cyan text-background shadow-lg shadow-hud-cyan/25"
                : "bg-background/50 border border-hud-blue/30 hover:border-hud-cyan"
            }`}
          >
            All Agents
          </button>
          {agentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSearchQuery("");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-hud-blue to-hud-cyan text-background shadow-lg shadow-hud-cyan/25"
                  : "bg-background/50 border border-hud-blue/30 hover:border-hud-cyan"
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Agent grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02 }}
                className="group hud-panel p-5 cursor-pointer hover:border-hud-cyan transition-all relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-hud-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative" onClick={() => setSelectedAgent(agent)}>
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                        border: `2px solid ${agent.color}`,
                        boxShadow: `0 0 20px ${agent.color}30`,
                      }}
                    >
                      {agent.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{agent.name}</h3>
                      <p className="text-sm text-foreground-secondary truncate">{agent.role}</p>
                    </div>
                    {agent.featured && (
                      <span className="px-2 py-0.5 bg-hud-cyan/20 text-hud-cyan text-xs rounded-full font-hud">
                        TOP
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-foreground-secondary line-clamp-2 mb-4">
                    {agent.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-foreground-secondary mb-4">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      {agent.rating}
                    </span>
                    <span>{agent.tasksCompleted.toLocaleString()} tasks</span>
                  </div>
                </div>

                {/* Hire button */}
                <Link href="/signup" className="block">
                  <button className="w-full py-2 rounded-lg bg-gradient-to-r from-hud-blue/20 to-hud-cyan/20 border border-hud-cyan/50 text-hud-cyan font-medium text-sm hover:bg-hud-cyan hover:text-background transition-all group-hover:shadow-lg group-hover:shadow-hud-cyan/20">
                    🚀 Hire {agent.name}
                  </button>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more / CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-foreground-secondary mb-4">
            Showing {filteredAgents.length} of {agents.length} agents
          </p>
          <Link href="/signup">
            <Button className="bg-gradient-to-r from-hud-blue to-hud-purple hover:shadow-lg hover:shadow-hud-purple/25">
              🎯 Hire All {agents.length} Agents
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Agent detail modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="hud-panel p-8 max-w-md w-full border-hud-cyan"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
                  style={{
                    background: `linear-gradient(135deg, ${selectedAgent.color}60, ${selectedAgent.color}30)`,
                    border: `2px solid ${selectedAgent.color}`,
                    boxShadow: `0 0 30px ${selectedAgent.color}40`,
                  }}
                >
                  {selectedAgent.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedAgent.name}</h3>
                  <p className="text-foreground-secondary">{selectedAgent.role}</p>
                  {selectedAgent.featured && (
                    <span className="inline-block mt-2 px-3 py-1 bg-hud-cyan/20 text-hud-cyan text-xs rounded-full font-hud">
                      TOP RATED
                    </span>
                  )}
                </div>
              </div>

              <p className="text-foreground-secondary mb-6">{selectedAgent.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background/50 rounded-xl p-4 text-center border border-hud-blue/20">
                  <div className="text-2xl font-bold gradient-text">{selectedAgent.tasksCompleted.toLocaleString()}</div>
                  <div className="text-sm text-foreground-secondary">Tasks Done</div>
                </div>
                <div className="bg-background/50 rounded-xl p-4 text-center border border-hud-blue/20">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="gradient-text">{selectedAgent.rating}</span>
                  </div>
                  <div className="text-sm text-foreground-secondary">Rating</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-hud text-xs text-hud-cyan tracking-wider mb-3">SKILLS</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-background/50 rounded-full text-sm border border-hud-blue/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/signup" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-hud-blue to-hud-cyan hover:shadow-lg hover:shadow-hud-cyan/25">
                    🚀 Hire {selectedAgent.name}
                  </Button>
                </Link>
                <Button variant="secondary" onClick={() => setSelectedAgent(null)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
