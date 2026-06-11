"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";

const STATUS = [
  "Parsing slices",
  "Enhancing volume",
  "Extracting isosurface",
  "Streaming geometry",
];

const BARS = 18;

export default function ProcessingOverlay({
  phase,
  uploadPct,
}: {
  phase: "upload" | "forge" | null;
  uploadPct: number;
}) {
  const [statusIdx, setStatusIdx] = useState(0);
  const [slowWarn, setSlowWarn] = useState(false);

  useEffect(() => {
    if (phase !== "forge") {
      setStatusIdx(0);
      setSlowWarn(false);
      return;
    }
    const cycle = setInterval(
      () => setStatusIdx((i) => (i + 1) % STATUS.length),
      2300
    );
    const slow = setTimeout(() => setSlowWarn(true), 10000);
    return () => {
      clearInterval(cycle);
      clearTimeout(slow);
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {phase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-10"
          style={{
            backgroundColor: "rgba(11,12,14,0.82)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div className="relative flex h-[170px] w-[200px] flex-col-reverse items-center justify-start gap-[5px]">
            {Array.from({ length: BARS }).map((_, i) => (
              <motion.span
                key={i}
                className="block h-[3px] rounded-full"
                style={{ backgroundColor: "var(--color-peach)" }}
                animate={{
                  width: ["28%", "92%", "28%"],
                  opacity: [0.15, 0.95, 0.15],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }}
              />
            ))}
            <motion.span
              aria-hidden="true"
              className="absolute left-[-12%] h-[1.5px] w-[124%]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--color-mint), transparent)",
                boxShadow: "0 0 18px rgba(169,217,192,0.5)",
              }}
              animate={{ top: ["100%", "-4%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            {phase === "upload" ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.5em] text-mint">
                  Uploading series
                </p>
                <p
                  style={{ fontFamily: "var(--font-clash)" }}
                  className="text-4xl font-semibold text-peach"
                >
                  {String(Math.min(uploadPct, 100)).padStart(3, "0")}
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-[0.5em] text-mint">
                  <ScrambleText
                    key={statusIdx}
                    text={STATUS[statusIdx]}
                    autoStart
                    framesPerChar={5}
                  />
                </p>
                {slowWarn && (
                  <p className="max-w-xs text-[9px] uppercase leading-loose tracking-[0.3em] text-peach/40">
                    Warming the forge. The first run after sleep can take up to a minute
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
