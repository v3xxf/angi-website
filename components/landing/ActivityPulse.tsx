"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents } from "@/lib/agents-data";

interface ActivityItem {
  id: string;
  text: string;
  agentName: string;
  agentAvatar: string;
  agentColor: string;
  timestamp: Date;
}

const activityTemplates = [
  { template: "{agent} just completed a market research report", category: "research" },
  { template: "{agent} scheduled 5 meetings for a client", category: "operations" },
  { template: "{agent} drafted a press release", category: "marketing" },
  { template: "{agent} processed 12 invoices", category: "finance" },
  { template: "{agent} reviewed code for security issues", category: "engineering" },
  { template: "{agent} created a social media campaign", category: "marketing" },
  { template: "{agent} analyzed competitor pricing", category: "research" },
  { template: "{agent} wrote a product description", category: "creative" },
  { template: "{agent} sent follow-up emails to leads", category: "sales" },
  { template: "{agent} updated the knowledge base", category: "customer" },
  { template: "{agent} reviewed an employment contract", category: "legal" },
  { template: "{agent} onboarded a new team member", category: "hr" },
  { template: "{agent} optimized database queries", category: "engineering" },
  { template: "{agent} created an expense report", category: "finance" },
  { template: "{agent} designed social media graphics", category: "creative" },
];

const cities = ["New York", "London", "Tokyo", "Sydney", "Paris", "Berlin", "Singapore", "Dubai", "Toronto", "Mumbai"];

function generateActivity(): ActivityItem {
  const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
  const categoryAgents = agents.filter(a => a.category === template.category);
  const agent = categoryAgents[Math.floor(Math.random() * categoryAgents.length)] || agents[0];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    text: template.template.replace("{agent}", agent.name),
    agentName: agent.name,
    agentAvatar: agent.avatar,
    agentColor: agent.color,
    timestamp: new Date(),
  };
}

export default function ActivityPulse() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeUsers, setActiveUsers] = useState(2847);

  useEffect(() => {
    // Initial activities
    setActivities([generateActivity(), generateActivity(), generateActivity()]);

    // Add new activity periodically
    const activityInterval = setInterval(() => {
      setActivities(prev => [generateActivity(), ...prev.slice(0, 4)]);
    }, 3000);

    // Update active users
    const userInterval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(userInterval);
    };
  }, []);

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background globe placeholder */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-accent-light/30" />
        <div className="absolute w-[500px] h-[500px] rounded-full border border-accent-light/20" />
        <div className="absolute w-[400px] h-[400px] rounded-full border border-accent-light/10" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="gradient-text">Pulse</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Real-time activity from teams around the world
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Activity feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-background-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Live Activity</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-foreground-secondary">{activeUsers.toLocaleString()} online</span>
                </div>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 p-3 bg-background rounded-lg"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${activity.agentColor}40, ${activity.agentColor}20)`,
                          border: `2px solid ${activity.agentColor}50`,
                        }}
                      >
                        {activity.agentAvatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{activity.text}</p>
                        <p className="text-xs text-foreground-secondary">Just now</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Stats and globe area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-background-card border border-border rounded-xl p-6">
                <div className="text-4xl font-bold gradient-text mb-2">24/7</div>
                <div className="text-foreground-secondary">Always Working</div>
              </div>
              <div className="bg-background-card border border-border rounded-xl p-6">
                <div className="text-4xl font-bold gradient-text mb-2">150+</div>
                <div className="text-foreground-secondary">Countries</div>
              </div>
              <div className="bg-background-card border border-border rounded-xl p-6">
                <div className="text-4xl font-bold gradient-text mb-2">99.9%</div>
                <div className="text-foreground-secondary">Uptime</div>
              </div>
              <div className="bg-background-card border border-border rounded-xl p-6">
                <div className="text-4xl font-bold gradient-text mb-2">&lt;1s</div>
                <div className="text-foreground-secondary">Response Time</div>
              </div>
            </div>

            <div className="bg-background-card border border-border rounded-xl p-6">
              <h4 className="font-semibold mb-4">Active Regions</h4>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 bg-background rounded-full text-sm text-foreground-secondary flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
