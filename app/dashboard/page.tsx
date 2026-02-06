"use client";

import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import { agents } from "@/lib/agents-data";
import { pricingTiers, currencySymbols, LAUNCH_DATE } from "@/lib/constants";
import CountdownTimer from "@/components/dashboard/CountdownTimer";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { getUser, signOut, User, isAdmin, refreshUser } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";

type Currency = "USD" | "INR";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<Currency>("INR");
  const [isYearly, setIsYearly] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Always refresh user data from server to get latest plan/role
    const loadFreshData = async () => {
      const result = await refreshUser();
      if (result.user) {
        setUser(result.user);
        setUserIsAdmin(result.user.role === "admin");
      } else {
        // Fallback to localStorage if server is unreachable
        setUser(currentUser);
        setUserIsAdmin(isAdmin());
      }

      // Check if redirected from payment
      if (searchParams.get("payment") === "success") {
        setPaymentSuccess(true);
        // Clear the URL param
        window.history.replaceState({}, "", "/dashboard");
      }

      setLoading(false);
    };

    loadFreshData();
  }, [router, searchParams]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const formatPrice = (price: number, curr: Currency) => {
    const symbol = currencySymbols[curr];
    if (curr === "INR") {
      return `${symbol}${price.toLocaleString("en-IN")}`;
    }
    return `${symbol}${price}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-hud-cyan/30 border-t-hud-cyan rounded-full animate-spin" />
          <span className="text-foreground-secondary font-hud">LOADING...</span>
        </div>
      </main>
    );
  }

  const isPaid = user?.plan !== "free";
  const isLaunched = new Date() >= LAUNCH_DATE;

  // Show pricing wall if user hasn't paid
  if (!isPaid) {
    return (
      <main className="min-h-screen bg-background relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 circuit-bg opacity-20" />
        <div className="fixed inset-0 bg-gradient-to-b from-hud-blue/5 via-background to-hud-purple/5" />

        {/* Header */}
        <header className="relative z-20 border-b border-hud-blue/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold gradient-text leading-tight">Angi Deck</span>
                <span className="text-[9px] text-hud-cyan/70 tracking-wider">ZENGUARD HEADQUARTERS</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {userIsAdmin && (
                <Link href="/admin" className="text-red-400 hover:text-red-300 text-sm font-medium transition">
                  Admin Panel
                </Link>
              )}
              <span className="text-foreground-secondary text-sm hidden sm:block">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          {/* Welcome + locked preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
              WELCOME, {user?.name?.toUpperCase() || "AGENT"}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Your AI Team is <span className="gradient-text">Ready</span>
            </h1>
            <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
              Unlock your full AI workforce by choosing a plan below.
            </p>
          </motion.div>

          {/* Locked agent preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <div className="hud-panel p-6 md:p-8 relative overflow-hidden">
              {/* Blur overlay */}
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Unlock Your AI Team</h3>
                <p className="text-foreground-secondary text-sm mb-4">
                  Choose a plan to access your agents
                </p>
              </div>

              {/* Preview content (blurred) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {agents.slice(0, 8).map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background/50"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                      style={{
                        background: `linear-gradient(135deg, ${agent.color}40, ${agent.color}20)`,
                        border: `2px solid ${agent.color}50`,
                      }}
                    >
                      {agent.avatar}
                    </div>
                    <span className="font-medium text-sm">{agent.name}</span>
                    <span className="text-xs text-foreground-secondary text-center">
                      {agent.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Currency & Billing toggles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8"
          >
            {/* Currency toggle */}
            <div className="flex items-center gap-3 hud-panel px-4 py-2">
              <span className="text-sm text-foreground-secondary">Currency:</span>
              <button
                onClick={() => setCurrency("INR")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currency === "INR"
                    ? "bg-hud-cyan text-background"
                    : "text-foreground-secondary hover:text-white"
                }`}
              >
                ₹ INR
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currency === "USD"
                    ? "bg-hud-cyan text-background"
                    : "text-foreground-secondary hover:text-white"
                }`}
              >
                $ USD
              </button>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center gap-4">
              <span className={isYearly ? "text-foreground-secondary" : "font-medium"}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-7 rounded-full bg-background border border-hud-blue/30"
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 rounded-full bg-hud-cyan"
                  animate={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
              <span className={isYearly ? "font-medium" : "text-foreground-secondary"}>
                Yearly <span className="text-green-400 text-sm">(Save 2 months)</span>
              </span>
            </div>
          </motion.div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {pricingTiers.map((tier, index) => {
              const price = tier.price[currency];
              const displayPrice = isYearly ? price.yearly : price.monthly;
              const isPopular = tier.popular;

              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`hud-panel p-6 relative ${
                    isPopular ? "border-hud-cyan bg-hud-cyan/5 scale-105" : ""
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-hud-cyan text-background text-xs font-bold rounded-full">
                      RECOMMENDED
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-foreground-secondary text-sm">{tier.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold gradient-text">
                        {formatPrice(displayPrice, currency)}
                      </span>
                      <span className="text-foreground-secondary">
                        /{isYearly ? "year" : "month"}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-green-400 mt-1">
                        Save {formatPrice(price.monthly * 2, currency)}
                      </p>
                    )}
                  </div>

                  {/* Agent preview */}
                  <div className="mb-4 p-3 bg-background/50 rounded-lg">
                    <div className="flex -space-x-2 mb-2">
                      {agents.slice(0, Math.min(tier.agentCount, 5)).map((agent) => (
                        <div
                          key={agent.id}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-background"
                          style={{
                            background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                          }}
                        >
                          {agent.avatar}
                        </div>
                      ))}
                      {tier.agentCount > 5 && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs bg-hud-purple/30 border-2 border-background">
                          +{tier.agentCount - 5}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-foreground-secondary">
                      {tier.agentCount} agents
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {tier.features.slice(0, 5).map((feature) => (
                      <li key={feature.name} className="flex items-center gap-2 text-sm">
                        <span className="text-hud-cyan">✓</span>
                        <span className="text-foreground-secondary">{feature.name}:</span>
                        <span className="font-medium">{feature.value}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/checkout?plan=${tier.id}&billing=${isYearly ? "yearly" : "monthly"}&currency=${currency}`}
                  >
                    <Button
                      className={`w-full ${isPopular ? "bg-hud-cyan hover:bg-hud-cyan/90" : ""}`}
                      variant={isPopular ? "primary" : "secondary"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-wrap items-center justify-center gap-6 text-foreground-secondary text-sm">
              <span className="flex items-center gap-2">
                <span className="text-green-400">🔒</span> Secure Payment via Razorpay
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Cancel Anytime
              </span>
              <span className="flex items-center gap-2">
                <span className="text-green-400">💳</span> UPI, Cards, Net Banking
              </span>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  // Paid user view - Show launch countdown and team
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Payment Success Banner */}
      {paymentSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-green-500/20 border border-green-500/50 text-green-400 px-8 py-4 rounded-xl backdrop-blur-sm text-center"
        >
          <div className="text-lg font-bold mb-1">Payment Successful! 🎉</div>
          <div className="text-sm text-green-300">Your {user?.plan} plan is now active.</div>
        </motion.div>
      )}

      {/* Background */}
      <div className="fixed inset-0 circuit-bg opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-hud-blue/5 via-background to-hud-purple/5" />

      {/* Header */}
      <header className="relative z-20 border-b border-hud-blue/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-hud-blue to-hud-purple flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold gradient-text leading-tight">Angi Deck</span>
              <span className="text-[9px] text-hud-cyan/70 tracking-wider">ZENGUARD HEADQUARTERS</span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {userIsAdmin && (
              <Link href="/admin" className="text-red-400 hover:text-red-300 text-sm font-medium transition">
                Admin Panel
              </Link>
            )}
            <span className="text-foreground-secondary text-sm hidden sm:block">
              {user?.email}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-hud-cyan/20 text-hud-cyan capitalize font-hud">
              {user?.plan} Plan
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {!isLaunched ? (
          // Pre-launch view
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
                MISSION BRIEFING
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Welcome, {user?.name?.split(" ")[0] || "Agent"}! 🎉
              </h1>
              <p className="text-xl text-foreground-secondary mb-8">
                Your AI team is preparing for launch. Here&apos;s when the magic begins:
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <CountdownTimer />
              <p className="text-sm text-foreground-secondary mt-4">
                Launch date: March 3rd, 2026
              </p>
            </motion.div>

            {/* What to expect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="hud-panel p-8 text-left mb-8"
            >
              <h2 className="text-xl font-semibold mb-6 font-hud text-hud-cyan">
                WHAT&apos;S COMING
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-hud-cyan">✓</span>
                  <span>Full access to your AI team based on your {user?.plan} plan</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-hud-cyan">✓</span>
                  <span>Integration setup for email, calendar, and more</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-hud-cyan">✓</span>
                  <span>Personalized onboarding to get you started</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-hud-cyan">✓</span>
                  <span>Priority support from our team</span>
                </li>
              </ul>
            </motion.div>

            {/* Your team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hud-panel p-8"
            >
              <h2 className="text-xl font-semibold mb-6 font-hud text-hud-cyan">
                YOUR AI TEAM
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {agents
                  .slice(0, user?.plan === "starter" ? 3 : user?.plan === "pro" ? 7 : 8)
                  .map((agent) => (
                    <div
                      key={agent.id}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-background/50"
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                        style={{
                          background: `linear-gradient(135deg, ${agent.color}60, ${agent.color}30)`,
                          border: `2px solid ${agent.color}`,
                        }}
                      >
                        {agent.avatar}
                      </div>
                      <span className="font-medium text-sm">{agent.name}</span>
                      <span className="text-xs text-foreground-secondary text-center">
                        {agent.role}
                      </span>
                    </div>
                  ))}
              </div>
              {user?.plan === "enterprise" && (
                <p className="text-center text-foreground-secondary mt-4 text-sm">
                  + 108 more agents available
                </p>
              )}
            </motion.div>
          </div>
        ) : (
          // Post-launch view
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-4">Welcome to Angi Deck!</h1>
              <p className="text-foreground-secondary mb-8">
                Your AI team is ready. Start a conversation to begin.
              </p>
              <Button size="lg" className="bg-hud-cyan hover:bg-hud-cyan/90">
                Start Chatting
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-hud-cyan/30 border-t-hud-cyan rounded-full animate-spin" />
            <span className="text-foreground-secondary font-hud">LOADING...</span>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
