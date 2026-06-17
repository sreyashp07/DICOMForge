"use client";

import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { usePageTransition } from "@/components/ui/PageTransition";

const spring = { type: "spring", stiffness: 260, damping: 22 } as const;

export default function AccessIcon() {
  const { user } = useAuth();
  const { navigate } = usePageTransition();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "";

  return (
    <motion.button
      onClick={() => navigate(user ? "/dashboard" : "/access")}
      aria-label={user ? "Open the forge floor" : "Sign in"}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.92 }}
      className="group fixed top-6 z-[9600] flex h-11 items-center justify-end"
      style={{ right: "calc(clamp(16px, 5vw, 64px) + 46px)" }}
    >
      <motion.span
        variants={{
          rest: { opacity: 0, x: 10, scale: 0.96 },
          hover: { opacity: 1, x: 0, scale: 1 },
        }}
        transition={spring}
        className="pointer-events-none mr-3 whitespace-nowrap text-[9px] uppercase tracking-[0.4em] text-mint"
      >
        {user ? "Forge floor" : "Sign in"}
      </motion.span>

      <span className="relative flex h-11 w-11 items-center justify-center">
        <motion.span
          variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 180, scale: 1.12 } }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute h-8 w-8 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(243,191,163,0.55), rgba(169,217,192,0.65), rgba(243,191,163,0.55))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1px))",
          }}
        />

        {user ? (
          <span className="relative flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <circle cx="9" cy="6" r="3" fill="none" stroke="var(--color-peach)" strokeWidth="1.4" />
              <path
                d="M3.5 15.5 C3.5 11.8 6 10.4 9 10.4 C12 10.4 14.5 11.8 14.5 15.5"
                fill="none"
                stroke="var(--color-peach)"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <motion.span
              variants={{ rest: { opacity: 0, scale: 0.5 }, hover: { opacity: 1, scale: 1 } }}
              transition={spring}
              style={{ fontFamily: "var(--font-syne)" }}
              className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-mint text-[8px] font-extrabold text-ink"
            >
              {initial}
            </motion.span>
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-mint"
            />
          </span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className="relative">
            <motion.g
              variants={{ rest: { opacity: 1, x: 0 }, hover: { opacity: 0, x: 7 } }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
            >
              <path d="M3 10 H13" stroke="var(--color-peach)" strokeWidth="1.6" strokeLinecap="round" />
              <path
                d="M9 5.5 L13.8 10 L9 14.5"
                fill="none"
                stroke="var(--color-peach)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
            <motion.g
              variants={{ rest: { opacity: 0, pathLength: 0 }, hover: { opacity: 1, pathLength: 1 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.circle
                cx="10"
                cy="7"
                r="3.1"
                fill="none"
                stroke="var(--color-mint)"
                strokeWidth="1.5"
                variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
              <motion.path
                d="M4 17 C4 13 7 11.6 10 11.6 C13 11.6 16 13 16 17"
                fill="none"
                stroke="var(--color-mint)"
                strokeWidth="1.5"
                strokeLinecap="round"
                variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
              />
            </motion.g>
          </svg>
        )}
      </span>
    </motion.button>
  );
}
