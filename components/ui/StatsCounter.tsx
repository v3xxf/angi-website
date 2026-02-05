"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatsCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export default function StatsCounter({ 
  end, 
  duration = 2, 
  prefix = "", 
  suffix = "",
  label 
}: StatsCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeOutExpo * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "K";
    }
    return num.toLocaleString();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold gradient-text">
        {prefix}{formatNumber(count)}{suffix}
      </div>
      <div className="text-foreground-secondary mt-1">{label}</div>
    </motion.div>
  );
}

// Live counter that increments over time
export function LiveStatsCounter({ 
  baseValue,
  incrementPerSecond = 0.5,
  label 
}: { 
  baseValue: number;
  incrementPerSecond?: number;
  label: string;
}) {
  const [count, setCount] = useState(baseValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.random() * incrementPerSecond * 2);
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementPerSecond]);

  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-foreground tabular-nums">
        {Math.floor(count).toLocaleString()}
      </div>
      <div className="text-foreground-secondary text-sm mt-1">{label}</div>
    </div>
  );
}
