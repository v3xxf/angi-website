"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalLine {
  type: "input" | "output" | "agent";
  text: string;
  agent?: string;
  agentColor?: string;
}

const terminalSequence: TerminalLine[] = [
  { type: "input", text: "Schedule a meeting with the design team for next Tuesday" },
  { type: "agent", text: "On it! Checking calendars...", agent: "Kai", agentColor: "#06b6d4" },
  { type: "output", text: "✓ Found 3 available slots. Sent invites to 5 team members." },
  { type: "input", text: "Research our top 3 competitors' pricing strategies" },
  { type: "agent", text: "Deploying research team...", agent: "Nova", agentColor: "#10b981" },
  { type: "agent", text: "Analyzing pricing data...", agent: "Ivy", agentColor: "#10b981" },
  { type: "output", text: "✓ Comprehensive report ready. Found 12 key insights." },
  { type: "input", text: "Write a LinkedIn post about our product launch" },
  { type: "agent", text: "Crafting engaging content...", agent: "Zara", agentColor: "#8b5cf6" },
  { type: "output", text: "✓ Post ready for review. Optimized for engagement." },
  { type: "input", text: "Send invoice to Acme Corp for $4,500" },
  { type: "agent", text: "Processing invoice...", agent: "Aria", agentColor: "#f59e0b" },
  { type: "output", text: "✓ Invoice #1247 sent. Payment link included." },
];

export default function TypingTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  // Animation state managed by effects

  useEffect(() => {
    if (currentLine >= terminalSequence.length) {
      // Reset after a delay
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLine(0);
        setCurrentChar(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const line = terminalSequence[currentLine];
    
    if (currentChar < line.text.length) {
      const timeout = setTimeout(() => {
        setCurrentChar(prev => prev + 1);
      }, line.type === "input" ? 30 : 15);
      return () => clearTimeout(timeout);
    } else {
      // Line complete, add to lines and move to next
      const timeout = setTimeout(() => {
        setLines(prev => [...prev.slice(-5), { ...line }]);
        setCurrentLine(prev => prev + 1);
        setCurrentChar(0);
      }, line.type === "output" ? 800 : 400);
      return () => clearTimeout(timeout);
    }
  }, [currentLine, currentChar]);

  const currentLineData = terminalSequence[currentLine];
  const displayText = currentLineData?.text.slice(0, currentChar) || "";

  return (
    <div className="bg-background/80 backdrop-blur-xl border border-border rounded-xl p-4 font-mono text-sm max-w-xl w-full">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-foreground-secondary text-xs">angi terminal</span>
      </div>

      {/* Previous lines */}
      <div className="space-y-2 mb-2">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2"
            >
              {line.type === "input" && (
                <>
                  <span className="text-accent-light">→</span>
                  <span className="text-foreground">{line.text}</span>
                </>
              )}
              {line.type === "agent" && (
                <>
                  <span style={{ color: line.agentColor }}>[{line.agent}]</span>
                  <span className="text-foreground-secondary">{line.text}</span>
                </>
              )}
              {line.type === "output" && (
                <span className="text-green-400">{line.text}</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Current typing line */}
      {currentLineData && (
        <div className="flex items-start gap-2">
          {currentLineData.type === "input" && (
            <>
              <span className="text-accent-light">→</span>
              <span className="text-foreground">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </>
          )}
          {currentLineData.type === "agent" && (
            <>
              <span style={{ color: currentLineData.agentColor }}>[{currentLineData.agent}]</span>
              <span className="text-foreground-secondary">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
            </>
          )}
          {currentLineData.type === "output" && (
            <span className="text-green-400">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
