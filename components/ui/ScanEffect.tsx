"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScanEffect() {
  const [isScanning, setIsScanning] = useState(true);
  const [systemText, setSystemText] = useState("");

  useEffect(() => {
    const sequence = [
      "INITIALIZING NEURAL INTERFACE...",
      "LOADING AI AGENTS...",
      "ESTABLISHING SECURE CONNECTION...",
      "CALIBRATING RESPONSE MATRIX...",
      "SYSTEM ONLINE",
    ];
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < sequence.length) {
        setSystemText(sequence[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsScanning(false), 500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isScanning && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          {/* Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-hud-cyan to-transparent"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              boxShadow: "0 0 20px 10px rgba(0, 255, 242, 0.3)",
            }}
          />

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-hud-cyan" />
          <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-hud-cyan" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-hud-cyan" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-hud-cyan" />

          {/* Center content */}
          <div className="text-center z-10">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center relative"
            >
              <span className="text-4xl font-bold text-white font-hud">A</span>
              <div className="absolute inset-0 rounded-2xl animate-pulse-glow" />
            </motion.div>

            {/* System text */}
            <motion.div
              className="font-mono text-hud-cyan text-sm tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="inline-block w-2 h-4 bg-hud-cyan mr-2 animate-flicker" />
              {systemText}
            </motion.div>

            {/* Progress bar */}
            <div className="mt-8 w-64 h-1 bg-background-secondary rounded-full overflow-hidden mx-auto">
              <motion.div
                className="h-full bg-gradient-to-r from-hud-blue to-hud-cyan"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Data stream effect on sides */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-hud-blue/50 to-transparent" />
          <div className="absolute right-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-hud-blue/50 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
