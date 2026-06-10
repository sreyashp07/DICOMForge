"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";
import MediaFrame from "@/components/ui/MediaFrame";
import { usePageTransition } from "@/components/ui/PageTransition";

const STEPS = [
  { n: "01", t: "Parse", d: "Each DICOM slice is read with pydicom, validated, and assembled into a sorted volumetric stack." },
  { n: "02", t: "Enhance", d: "CLAHE and gamma correction sharpen hidden voxel densities without touching the underlying anatomy." },
  { n: "03", t: "Extract", d: "Marching cubes walks the volume and pulls a clean, watertight isosurface from the enhanced field." },
  { n: "04", t: "Stream", d: "Vertices and faces are written straight into a binary STL stream. Nothing ever touches a disk." },
];

const STATS = [
  { v: 40, suffix: "", label: "DICOM slices per forge, capped for safety" },
  { v: 300, suffix: "MB", label: "Maximum deployment footprint" },
  { v: 0, suffix: "", label: "Disk writes across the entire pipeline" },
  { v: 4, suffix: "", label: "Deterministic stages, no ML black box" },
];

function Stat({ v, suffix, label }: { v: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, v, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (val) => {
        if (ref.current) ref.current.textContent = String(Math.round(val));
      },
    });
    return () => controls.stop();
  }, [inView, v]);

  return (
    <div className="border-t border-peach/15 pt-6">
      <p style={{ fontFamily: "var(--font-clash)" }} className="text-[clamp(44px,6vw,90px)] font-semibold leading-none text-peach">
        <span ref={ref}>0</span>
        <span className="text-mint">{suffix}</span>
      </p>
      <p className="mt-3 max-w-[26ch] text-[10px] uppercase leading-relaxed tracking-[0.25em] text-peach/50">{label}</p>
    </div>
  );
}

export default function TechnologyPage() {
  const { navigate } = usePageTransition();

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-ink px-[clamp(20px,5vw,64px)] pb-[14vh] text-peach">
      <section className="flex min-h-[72vh] flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mb-6 text-[10px] uppercase tracking-[0.5em] text-mint"
        >
          02 - Technology
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[clamp(34px,6vw,84px)] font-light uppercase tracking-[0.25em]"
        >
          <ScrambleText text="What we do" autoStart delay={1.1} />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="mt-8 max-w-md text-[11px] uppercase leading-loose tracking-[0.3em] text-peach/45"
        >
          A four-stage deterministic forge. Lightweight by design, accurate by mathematics.
        </motion.p>
      </section>

      <section className="mx-auto max-w-5xl">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-8 border-t border-peach/15 py-10 md:grid-cols-[80px_280px_1fr]"
          >
            <span className="text-[10px] tracking-[0.4em] text-mint">{s.n}</span>
            <h2 style={{ fontFamily: "var(--font-clash)" }} className="text-[clamp(26px,3.6vw,48px)] font-semibold uppercase tracking-tight">
              {s.t}
            </h2>
            <p className="col-span-2 mt-4 max-w-xl text-sm leading-relaxed tracking-wide text-peach/60 md:col-span-1 md:mt-0">
              {s.d}
            </p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto mt-[14vh] grid max-w-5xl grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
        {STATS.map((s) => (
          <Stat key={s.label} v={s.v} suffix={s.suffix} label={s.label} />
        ))}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9 }}
        className="mx-auto mt-[14vh] max-w-5xl"
      >
        <MediaFrame
          alt="Diagram of the DicomForge processing pipeline"
          label="Asset 02 - Pipeline visual"
          note="1600 x 900 - volumetric render or pipeline diagram"
        />
      </motion.section>

      <div className="mx-auto mt-[12vh] flex max-w-5xl justify-end">
        <button onClick={() => navigate("/insights")} className="group flex items-baseline gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-mint">Next</span>
          <span
            style={{ fontFamily: "var(--font-clash)" }}
            className="text-[clamp(22px,3vw,38px)] font-semibold uppercase tracking-tight text-peach transition-transform duration-300 group-hover:translate-x-2"
          >
            Insights
          </span>
        </button>
      </div>
    </main>
  );
}
