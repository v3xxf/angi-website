"use client";

import { motion } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed inset-0 circuit-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-br from-hud-blue/10 via-background to-hud-purple/10" />
      
      {/* Animated scan line */}
      <motion.div
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-hud-cyan/50 to-transparent"
        animate={{ y: [0, 1000] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Back to home */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground-secondary hover:text-hud-cyan transition-colors"
        >
          <span>←</span>
          <span className="text-sm">Back to Home</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md p-6">
        <AuthForm mode="login" />

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-4 text-xs text-foreground-secondary"
        >
          <span className="flex items-center gap-1">
            <span className="text-green-400">🔒</span> Secure login
          </span>
          <span className="flex items-center gap-1">
            <span className="text-green-400">✓</span> Your data is safe
          </span>
        </motion.div>
      </div>
    </main>
  );
}
