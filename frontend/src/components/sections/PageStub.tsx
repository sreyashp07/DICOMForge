"use client";

import { motion } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";

export default function PageStub({
  index,
  title,
  blurb,
}: {
  index: string;
  title: string;
  blurb: string;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center text-peach">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="mb-6 text-[10px] uppercase tracking-[0.5em] text-mint"
      >
        {index}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[clamp(34px,6vw,84px)] font-light uppercase tracking-[0.3em]"
        >
          <ScrambleText text={title} autoStart delay={1.1} />
        </h1>
      </motion.div>
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="my-8 h-px w-24 origin-center bg-mint/40"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.45, duration: 0.7 }}
        className="max-w-sm text-[11px] uppercase leading-loose tracking-[0.3em] text-peach/45"
      >
        {blurb}
      </motion.p>
    </main>
  );
}
