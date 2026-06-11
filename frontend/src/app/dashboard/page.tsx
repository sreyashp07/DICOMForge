"use client";

import { motion } from "motion/react";
import RequireAuth from "@/components/ui/RequireAuth";
import ScrambleText from "@/components/ui/ScrambleText";
import { useAuth } from "@/context/AuthContext";
import { usePageTransition } from "@/components/ui/PageTransition";

function DashboardInner() {
  const { user, logout } = useAuth();
  const { navigate } = usePageTransition();

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-peach">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="mb-6 text-[10px] uppercase tracking-[0.5em] text-mint"
      >
        The Forge Floor
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: "var(--font-clash)" }}
        className="text-[clamp(30px,5vw,72px)] font-semibold uppercase tracking-tight"
      >
        <ScrambleText text={`Welcome, ${user?.name ?? "Operator"}`} autoStart delay={1.1} framesPerChar={6} />
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="mt-7 max-w-sm text-[11px] uppercase leading-loose tracking-[0.3em] text-peach/45"
      >
        DICOM intake, processing and the 3D viewer arrive in Phases 7 and 8.
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 0.7 }}
        onClick={() => {
          logout();
          navigate("/");
        }}
        className="mt-12 border border-peach/25 px-8 py-3 text-[10px] uppercase tracking-[0.45em] text-peach/70 transition-colors duration-300 hover:border-mint hover:text-mint"
      >
        Log out
      </motion.button>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardInner />
    </RequireAuth>
  );
}
