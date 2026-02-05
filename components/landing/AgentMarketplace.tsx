"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents, agentCategories, searchAgents, getAgentsByCategory, type Agent } from "@/lib/agents-data";
import Button from "../ui/Button";

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
    <section id="marketplace" className="py-32 bg-background-secondary relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Agent <span className="gradient-text">Marketplace</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Browse {agents.length}+ specialized agents. Find the perfect team for any task.
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
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-secondary"
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
              placeholder="Search for an agent... (e.g., 'SEO', 'bookkeeper', 'email')"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCategory(null);
              }}
              className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-full text-lg focus:outline-none focus:border-accent-light transition-colors"
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
                ? "bg-accent-light text-white"
                : "bg-background-card border border-border hover:border-foreground-secondary"
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
                  ? "bg-accent-light text-white"
                  : "bg-background-card border border-border hover:border-foreground-secondary"
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
                onClick={() => setSelectedAgent(agent)}
                className="group bg-background-card border border-border rounded-xl p-5 cursor-pointer hover:border-accent-light/50 transition-all hover:shadow-lg hover:shadow-accent-light/5"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
                      border: `2px solid ${agent.color}50`,
                    }}
                  >
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{agent.name}</h3>
                    <p className="text-sm text-foreground-secondary truncate">{agent.role}</p>
                  </div>
                  {agent.featured && (
                    <span className="px-2 py-0.5 bg-accent-light/10 text-accent-light text-xs rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-foreground-secondary line-clamp-2 mb-4">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between text-xs text-foreground-secondary">
                  <span className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {agent.rating}
                  </span>
                  <span>{agent.tasksCompleted.toLocaleString()} tasks</span>
                </div>
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
          <Button variant="secondary">
            View All {agents.length} Agents
          </Button>
        </motion.div>
      </div>

      {/* Agent detail modal */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedAgent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-background-card border border-border rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{
                    background: `linear-gradient(135deg, ${selectedAgent.color}40, ${selectedAgent.color}20)`,
                    border: `2px solid ${selectedAgent.color}`,
                  }}
                >
                  {selectedAgent.avatar}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedAgent.name}</h3>
                  <p className="text-foreground-secondary">{selectedAgent.role}</p>
                </div>
              </div>

              <p className="text-foreground-secondary mb-6">{selectedAgent.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{selectedAgent.tasksCompleted.toLocaleString()}</div>
                  <div className="text-sm text-foreground-secondary">Tasks Completed</div>
                </div>
                <div className="bg-background rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold flex items-center justify-center gap-1">
                    <span className="text-yellow-400">★</span>
                    {selectedAgent.rating}
                  </div>
                  <div className="text-sm text-foreground-secondary">Rating</div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-background rounded-full text-sm text-foreground-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1">Hire {selectedAgent.name}</Button>
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
