"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { agents } from "@/lib/agents-data";

// Web Speech API types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface VoiceResponse {
  text: string;
  agents: string[];
}

const voiceCommands: Record<string, VoiceResponse> = {
  "schedule a meeting": {
    text: "I'll coordinate with Kai to find the best time. Checking calendars now...",
    agents: ["o2"],
  },
  "research competitors": {
    text: "Deploying Nova and Ivy for deep competitive analysis. This will take about 30 seconds...",
    agents: ["r1", "r3"],
  },
  "write an email": {
    text: "Maya is drafting your email now. What's the topic and recipient?",
    agents: ["m1"],
  },
  "create a post": {
    text: "Zara is on it! Crafting engaging content for your social channels...",
    agents: ["c1"],
  },
  "check finances": {
    text: "Aria is pulling your financial overview. One moment...",
    agents: ["f1"],
  },
};

export default function VoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<VoiceResponse | null>(null);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(Array(20).fill(4));
  const [deployedAgents, setDeployedAgents] = useState<typeof agents>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript.toLowerCase();
        setTranscript(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        processCommand(transcript);
      };
    }
  }, [transcript]);

  // Animate waveform when listening
  useEffect(() => {
    if (!isListening) {
      setWaveformHeights(Array(20).fill(4));
      return;
    }

    const interval = setInterval(() => {
      setWaveformHeights(
        Array(20).fill(0).map(() => 4 + Math.random() * 32)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isListening]);

  const startListening = () => {
    setTranscript("");
    setResponse(null);
    setDeployedAgents([]);
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const processCommand = (text: string) => {
    // Find matching command
    for (const [key, value] of Object.entries(voiceCommands)) {
      if (text.includes(key)) {
        setResponse(value);
        // Deploy agents
        const deployedAgentsList = value.agents
          .map(id => agents.find(a => a.id === id))
          .filter(Boolean) as typeof agents;
        setDeployedAgents(deployedAgentsList);
        return;
      }
    }
    
    // Default response
    if (text.length > 0) {
      setResponse({
        text: "I understand. Let me route this to the right agents...",
        agents: ["o1"],
      });
      setDeployedAgents([agents.find(a => a.id === "o1")!]);
    }
  };

  // Demo mode - simulate voice command
  const runDemo = () => {
    setTranscript("");
    setResponse(null);
    setDeployedAgents([]);
    setIsListening(true);

    const demoText = "research competitors";
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex <= demoText.length) {
        setTranscript(demoText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsListening(false);
        processCommand(demoText);
      }
    }, 100);
  };

  return (
    <section id="demo" className="py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 circuit-bg opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            VOICE INTERFACE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Talk to <span className="gradient-text">Angi</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Just speak your command. Watch Angi deploy the right agents instantly.
          </p>
        </motion.div>

        {/* Voice interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="hud-panel p-8"
        >
          {/* Waveform visualization */}
          <div className="flex items-center justify-center gap-1 h-16 mb-8">
            {waveformHeights.map((height, i) => (
              <motion.div
                key={i}
                className="w-1.5 rounded-full"
                style={{
                  background: isListening
                    ? `linear-gradient(to top, var(--hud-blue), var(--hud-cyan))`
                    : "rgba(0, 212, 255, 0.3)",
                }}
                animate={{ height }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>

          {/* Mic button */}
          <div className="flex justify-center mb-8">
            <motion.button
              onClick={recognitionRef.current ? startListening : runDemo}
              disabled={isListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center relative ${
                isListening ? "bg-red-500/20" : "bg-hud-blue/20"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                border: `2px solid ${isListening ? "#ef4444" : "var(--hud-cyan)"}`,
                boxShadow: isListening
                  ? "0 0 30px rgba(239, 68, 68, 0.5)"
                  : "0 0 30px rgba(0, 255, 242, 0.3)",
              }}
            >
              {isListening ? (
                <div className="w-6 h-6 bg-red-500 rounded animate-pulse" />
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-hud-cyan"
                >
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
              
              {/* Pulse rings when listening */}
              {isListening && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-500"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}
            </motion.button>
          </div>

          {/* Transcript */}
          <div className="text-center mb-6">
            <div className="font-mono text-lg text-white min-h-[28px]">
              {transcript ? `"${transcript}"` : (
                <span className="text-foreground-secondary">
                  {isListening ? "Listening..." : "Click the mic or try the demo"}
                </span>
              )}
            </div>
          </div>

          {/* Demo button */}
          {!isListening && !response && (
            <div className="text-center">
              <button
                onClick={runDemo}
                className="text-sm text-hud-cyan hover:text-hud-blue transition-colors underline"
              >
                Run demo command
              </button>
            </div>
          )}

          {/* Response */}
          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 pt-8 border-t border-hud-blue/20"
              >
                {/* Angi response */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                  <div>
                    <div className="font-hud text-xs text-hud-cyan mb-1">ANGI</div>
                    <p className="text-white">{response.text}</p>
                  </div>
                </div>

                {/* Deployed agents */}
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="font-hud text-xs text-hud-cyan mb-3 tracking-wider">
                    DEPLOYING AGENTS
                  </div>
                  <div className="flex gap-4">
                    {deployedAgents.map((agent, i) => (
                      <motion.div
                        key={agent.id}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex items-center gap-3"
                      >
                        <motion.div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{
                            background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}20)`,
                            border: `1px solid ${agent.color}`,
                          }}
                          animate={{
                            boxShadow: [
                              `0 0 10px ${agent.color}40`,
                              `0 0 20px ${agent.color}60`,
                              `0 0 10px ${agent.color}40`,
                            ],
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          {agent.avatar}
                        </motion.div>
                        <div>
                          <div className="text-sm font-medium text-white">{agent.name}</div>
                          <div className="text-xs text-foreground-secondary">{agent.role}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sample commands */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <div className="font-hud text-xs text-foreground-secondary mb-3 tracking-wider">
            TRY SAYING
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(voiceCommands).map((cmd) => (
              <span
                key={cmd}
                className="px-3 py-1 rounded-full text-sm bg-hud-blue/10 border border-hud-blue/30 text-hud-cyan"
              >
                &ldquo;{cmd}&rdquo;
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
