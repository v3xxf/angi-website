"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Agent } from "@/lib/agents-data";

interface HolographicCardProps {
  agent: Agent;
  onClick?: () => void;
}

export default function HolographicCard({ agent, onClick }: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXVal = ((y - centerY) / centerY) * -10;
    const rotateYVal = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotateXVal);
    setRotateY(rotateYVal);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="relative cursor-pointer group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Main card */}
      <div 
        className="relative overflow-hidden rounded-xl p-5"
        style={{
          background: `linear-gradient(135deg, ${agent.color}15 0%, rgba(15, 15, 35, 0.95) 100%)`,
          border: `1px solid ${agent.color}40`,
          boxShadow: isHovered 
            ? `0 0 30px ${agent.color}40, inset 0 0 30px ${agent.color}10`
            : `0 0 15px ${agent.color}20`,
        }}
      >
        {/* Scan line effect */}
        {isHovered && (
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${agent.color}, transparent)`,
              boxShadow: `0 0 10px ${agent.color}`,
            }}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}

        {/* Corner accents */}
        <div 
          className="absolute top-0 left-0 w-4 h-4 border-l border-t"
          style={{ borderColor: agent.color }}
        />
        <div 
          className="absolute top-0 right-0 w-4 h-4 border-r border-t"
          style={{ borderColor: agent.color }}
        />
        <div 
          className="absolute bottom-0 left-0 w-4 h-4 border-l border-b"
          style={{ borderColor: agent.color }}
        />
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 border-r border-b"
          style={{ borderColor: agent.color }}
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-2xl relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}20)`,
                border: `1px solid ${agent.color}`,
                boxShadow: `0 0 20px ${agent.color}40`,
              }}
            >
              {agent.avatar}
              {/* Holographic shine */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(135deg, transparent 40%, ${agent.color} 50%, transparent 60%)`,
                  backgroundSize: "200% 200%",
                  animation: isHovered ? "gradient 2s linear infinite" : "none",
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">{agent.name}</h3>
                {agent.featured && (
                  <span 
                    className="px-2 py-0.5 text-[10px] rounded font-hud tracking-wider"
                    style={{ 
                      background: `${agent.color}20`, 
                      color: agent.color,
                      border: `1px solid ${agent.color}40`,
                    }}
                  >
                    ELITE
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground-secondary">{agent.role}</p>
            </div>
          </div>

          <p className="text-sm text-foreground-secondary line-clamp-2 mb-4">
            {agent.description}
          </p>

          {/* Stats bar */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span style={{ color: agent.color }}>◆</span>
              <span className="text-foreground-secondary">{agent.tasksCompleted.toLocaleString()} tasks</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="text-white">{agent.rating}</span>
            </div>
          </div>

          {/* Skills on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 pt-3 border-t"
              style={{ borderColor: `${agent.color}30` }}
            >
              <div className="flex flex-wrap gap-1">
                {agent.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 text-[10px] rounded"
                    style={{ 
                      background: `${agent.color}15`, 
                      color: agent.color,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Holographic overlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${agent.color}00 0%, ${agent.color}20 50%, ${agent.color}00 100%)`,
            backgroundSize: "200% 200%",
            animation: "gradient 4s ease infinite",
          }}
        />
      </div>

      {/* Reflection */}
      <div
        className="absolute -bottom-4 left-2 right-2 h-8 opacity-20 blur-sm rounded-xl"
        style={{
          background: `linear-gradient(to bottom, ${agent.color}40, transparent)`,
          transform: "scaleY(-0.3) translateZ(-10px)",
        }}
      />
    </motion.div>
  );
}
