"use client";

import { motion } from "motion/react";

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
    <main className="relative flex min-h-dvh flex-col justify-end overflow-hidden bg-ink px-[clamp(20px,5vw,64px)] pb-[12vh] text-peach">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 text-[11px] uppercase tracking-[0.35em] text-mint"
      >
        Forge / {index}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: "var(--font-clash)" }}
        className="text-[clamp(44px,9vw,128px)] font-semibold uppercase leading-[0.95] tracking-tight"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.7 }}
        className="mt-5 max-w-md text-xs uppercase leading-relaxed tracking-[0.25em] text-peach/50"
      >
        {blurb}
      </motion.p>
    </main>
  );
}