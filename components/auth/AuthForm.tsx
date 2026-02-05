"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { signIn, signUp } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Validate phone number (at least 10 digits)
        const phoneDigits = phone.replace(/\D/g, "");
        if (phoneDigits.length < 10) {
          setError("Please enter a valid phone number (at least 10 digits)");
          setLoading(false);
          return;
        }
        
        const result = await signUp(email, password, name, phone);
        if (result.error) {
          setError(result.error.message);
        } else {
          router.push("/dashboard");
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error.message);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="hud-panel p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center shadow-lg shadow-hud-blue/25">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Angi Deck</span>
            <span className="text-[10px] text-hud-cyan/70 tracking-[0.2em] -mt-1">PART OF ZENGUARD HEADQUARTERS</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            {mode === "login" ? "Welcome Back" : "Join Angi Deck"}
          </h1>
          <p className="text-foreground-secondary">
            {mode === "login"
              ? "Sign in to access your AI command center"
              : "Create your account to meet your AI team"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground-secondary">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-hud-blue/30 focus:border-hud-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,242,0.2)] transition-all text-white placeholder-foreground-secondary"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground-secondary">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background/50 border border-hud-blue/30 focus:border-hud-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,242,0.2)] transition-all text-white placeholder-foreground-secondary"
                  placeholder="+91 9876543210"
                />
                <p className="text-xs text-foreground-secondary mt-1">
                  Required for account verification
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground-secondary">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-hud-blue/30 focus:border-hud-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,242,0.2)] transition-all text-white placeholder-foreground-secondary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-foreground-secondary">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-hud-blue/30 focus:border-hud-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,242,0.2)] transition-all text-white placeholder-foreground-secondary"
              placeholder="••••••••"
            />
            {mode === "signup" && (
              <p className="text-xs text-foreground-secondary mt-1">
                Minimum 6 characters
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-hud-blue to-hud-cyan hover:shadow-lg hover:shadow-hud-cyan/25 transition-all"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-foreground-secondary">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-hud-cyan hover:underline font-medium">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-hud-cyan hover:underline font-medium">
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Security note */}
        <div className="mt-6 pt-6 border-t border-hud-blue/20 text-center">
          <p className="text-xs text-foreground-secondary flex items-center justify-center gap-2">
            <span className="text-green-400">🔒</span>
            Your data is encrypted and secure
          </p>
        </div>
      </div>
    </motion.div>
  );
}
