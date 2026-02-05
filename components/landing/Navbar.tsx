"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-light to-blue-700 flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground leading-tight">Angi Deck</span>
            <span className="text-[10px] text-hud-cyan/70 tracking-wider">ZENGUARD HEADQUARTERS</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="#agents"
            className="text-foreground-secondary hover:text-foreground transition-colors"
          >
            Agents
          </Link>
          <Link
            href="#features"
            className="text-foreground-secondary hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-foreground-secondary hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-foreground-secondary hover:text-foreground transition-colors"
          >
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get Early Access</Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
