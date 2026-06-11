"use client";

import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { usePageTransition } from "@/components/ui/PageTransition";

export default function AccessIcon() {
  const { user } = useAuth();
  const { navigate } = usePageTransition();

  return (
    <motion.button
      onClick={() => navigate(user ? "/dashboard" : "/access")}
      aria-label={user ? "Open dashboard" : "Sign in"}
      initial="rest"
      whileHover="hover"
      className="fixed top-6 z-[9600] flex h-11 w-11 items-center justify-center"
      style={{ right: "calc(clamp(20px, 5vw, 64px) + 52px)" }}
    >
      <motion.span
        variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 90, scale: 1.08 } }}
        transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
        className="absolute h-7 w-7 rounded-full border border-peach/40"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(243,191,163,0.12), rgba(169,217,192,0.18), rgba(243,191,163,0.12))",
        }}
      />
      <svg width="14" height="14" viewBox="0 0 14 14" className="relative">
        <motion.path
          d="M1 7 H10"
          stroke="var(--color-peach)"
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={{ rest: { x: 0 }, hover: { x: 2 } }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
        <motion.path
          d="M6.5 3 L10.5 7 L6.5 11"
          fill="none"
          stroke="var(--color-peach)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{ rest: { x: 0 }, hover: { x: 2 } }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </svg>
      {user && (
        <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-mint" />
      )}
    </motion.button>
  );
}
