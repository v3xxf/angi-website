"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents } from "@/lib/agents-data";

interface Message {
  id: string;
  type: "user" | "angi" | "agent";
  text: string;
  agent?: typeof agents[0];
  timestamp: Date;
}

const demoPrompts = [
  "Help me write a marketing email",
  "Research my competitors",
  "Schedule a team meeting",
  "Create a social media post",
  "Analyze my expenses",
];

const demoResponses: Record<string, { response: string; agents: string[] }> = {
  "Help me write a marketing email": {
    response: "I'll get Maya and Zara on this. Maya will draft the email structure while Zara crafts compelling copy. Give me 30 seconds...",
    agents: ["m1", "c1"],
  },
  "Research my competitors": {
    response: "Perfect task for Nova and Ivy! They're already scanning the web, analyzing pricing, and gathering intel. Full report incoming...",
    agents: ["r1", "r3"],
  },
  "Schedule a team meeting": {
    response: "Kai is checking everyone's calendars right now. Found 3 available slots this week. Sending invites to your team...",
    agents: ["o2"],
  },
  "Create a social media post": {
    response: "Sarah's got this! She's analyzing trending topics and crafting a post optimized for engagement. Preview ready in a moment...",
    agents: ["m1"],
  },
  "Analyze my expenses": {
    response: "Aria and David are on it! Pulling your transaction data, categorizing expenses, and identifying savings opportunities...",
    agents: ["f1", "f2"],
  },
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "angi",
      text: "Hey! I'm Angi Deck, your AI team coordinator. What can I help you with today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate response delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = demoResponses[text] || {
      response: "Let me delegate this to the right agents. I'm assigning this task now and will update you shortly!",
      agents: ["o1"],
    };

    const angiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "angi",
      text: response.response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, angiMessage]);

    // Show agent assignments
    await new Promise(resolve => setTimeout(resolve, 500));
    
    for (const agentId of response.agents) {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        await new Promise(resolve => setTimeout(resolve, 400));
        const agentMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: "agent",
          text: `${agent.role} assigned. Working on it...`,
          agent,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, agentMessage]);
      }
    }

    setIsTyping(false);
  };

  return (
    <>
      {/* Chat toggle button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent-light shadow-lg shadow-accent-light/25 flex items-center justify-center text-white hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] bg-background-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-background-secondary">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-light to-blue-700 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <h3 className="font-semibold">Talk to Angi Deck</h3>
                  <p className="text-xs text-foreground-secondary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Online • Try the demo
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "agent" && message.agent && (
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${message.agent.color}60, ${message.agent.color}30)`,
                          border: `2px solid ${message.agent.color}`,
                        }}
                      >
                        {message.agent.avatar}
                      </div>
                      <div className="bg-background-secondary rounded-2xl rounded-tl-sm px-4 py-2">
                        <p className="text-xs text-foreground-secondary mb-1">{message.agent.name}</p>
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  )}
                  {message.type === "angi" && (
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-light to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        A
                      </div>
                      <div className="bg-background-secondary rounded-2xl rounded-tl-sm px-4 py-2">
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  )}
                  {message.type === "user" && (
                    <div className="bg-accent-light text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[85%]">
                      <p className="text-sm">{message.text}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-light to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                    A
                  </div>
                  <div className="bg-background-secondary rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-foreground-secondary animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-foreground-secondary animate-bounce [animation-delay:0.1s]" />
                      <span className="w-2 h-2 rounded-full bg-foreground-secondary animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-4 py-2 border-t border-border">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {demoPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs bg-background-secondary hover:bg-border rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:border-accent-light"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
