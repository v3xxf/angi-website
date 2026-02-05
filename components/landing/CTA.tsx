"use client";

import { motion } from "framer-motion";
import Button from "../ui/Button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-32 bg-background-secondary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-light/20 rounded-full blur-[100px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Meet Your{" "}
            <span className="gradient-text">Team?</span>
          </h2>
          <p className="text-xl text-foreground-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of entrepreneurs and professionals who are getting early access to Angi. Launch date: March 3rd, 2026.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg">Get Early Access</Button>
            </Link>
            <Link href="#pricing">
              <Button variant="secondary" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-foreground-secondary">
            No credit card required for free plan
          </p>
        </motion.div>
      </div>
    </section>
  );
}
