"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LAUNCH_DATE } from "@/lib/constants";
import { getTimeRemaining } from "@/lib/utils";

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(LAUNCH_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(LAUNCH_DATE));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeRemaining.days },
    { label: "Hours", value: timeRemaining.hours },
    { label: "Minutes", value: timeRemaining.minutes },
    { label: "Seconds", value: timeRemaining.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="text-center"
        >
          <div className="bg-background-card border border-border rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
            <motion.span
              key={unit.value}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-3xl md:text-5xl font-bold gradient-text"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
          </div>
          <span className="block mt-2 text-sm text-foreground-secondary">
            {unit.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
