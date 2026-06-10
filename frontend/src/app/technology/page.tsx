"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";
import MediaFrame from "@/components/ui/MediaFrame";
import { usePageTransition } from "@/components/ui/PageTransition";

const STEPS = [
  {
    n: "01",
    t: "Parse",
    d: "Every slice is read with pydicom, validated for format and order, then assembled into a single sorted volumetric stack. This raw three-dimensional field is what the rest of the forge works on.",
  },
  {
    n: "02",
    t: "Enhance",
    d: "Adaptive contrast equalization evens out local intensity while gamma correction lifts faint voxel densities. Thin bone walls and soft boundaries survive extraction instead of dissolving into noise.",
  },
  {
    n: "03",
    t: "Extract",
    d: "Marching cubes walks the enhanced volume cell by cell and pulls a clean, watertight isosurface. Deterministic geometry: identical input always forges identical output.",
  },
  {
    n: "04",
    t: "Stream",
    d: "Vertices and faces are packed straight into a binary STL stream in memory and sent back to the browser. Nothing is written to disk, and nothing persists after the response.",
  },
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
  const stageRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    if (!stage || !wrap) return;
    const cards = Array.from(wrap.children) as HTMLElement[];
    const N = cards.length;
    let raf = 0;

    const layout = () => {
      const r = stage.getBoundingClientRect();
      const total = Math.max(r.height - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, -r.top / total));
      const focus = p * (N - 1);
      cards.forEach((el, i) => {
        const d = i - focus;
        const x = Math.sin(d * 0.85) * 13;
        const y = d * 44;
        const s = Math.max(0.62, 1 - Math.abs(d) * 0.14);
        const o = Math.max(0, 1 - Math.abs(d) * 0.52);
        const ry = -Math.sin(d * 0.85) * 12;
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}vh, 0) scale(${s.toFixed(3)}) rotateY(${ry.toFixed(2)}deg)`;
        el.style.opacity = o.toFixed(3);
        el.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(layout);
    };

    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="relative min-h-dvh overflow-x-clip bg-ink px-[clamp(20px,5vw,64px)] pb-[14vh] text-peach">
      <section className="flex min-h-[68vh] flex-col items-center justify-center text-center">
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
          <ScrambleText text="What we do" autoStart delay={1.1} framesPerChar={8} />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="mt-8 max-w-md text-[11px] uppercase leading-loose tracking-[0.3em] text-peach/45"
        >
          A four-stage deterministic forge. Scroll through the pipeline.
        </motion.p>
      </section>

      <section ref={stageRef} className="relative h-[340vh]">
        <div className="sticky top-0 h-dvh">
          <p className="absolute left-1/2 top-10 z-[200] -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-mint">
            The pipeline - scroll
          </p>
          <div ref={wrapRef} className="absolute inset-0" style={{ perspective: "1400px" }}>
            {STEPS.map((s) => (
              <article
                key={s.n}
                className="absolute left-1/2 top-1/2 w-[clamp(300px,44vw,560px)] border border-peach/15 bg-surface/75 p-9 backdrop-blur-sm"
                style={{ willChange: "transform, opacity" }}
              >
                <p className="text-[10px] tracking-[0.4em] text-mint">{s.n}</p>
                <h2
                  style={{ fontFamily: "var(--font-clash)" }}
                  className="mt-3 text-[clamp(30px,4vw,56px)] font-semibold uppercase leading-none tracking-tight"
                >
                  {s.t}
                </h2>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-px w-full"
                  style={{ background: "linear-gradient(90deg, var(--color-mint), transparent 70%)" }}
                />
                <p className="mt-5 text-sm leading-relaxed tracking-wide text-peach/70">{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-[8vh] grid max-w-5xl grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2">
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
          src="/images/pipeline.jpg"
          alt="Diagram of the DicomForge processing pipeline"
          label="Asset 02 - Pipeline visual"
          note="1600 x 900"
          className="border border-peach/15"
        />
      </motion.section>

      <div className="mx-auto mt-[12vh] flex max-w-5xl justify-end">
        <button onClick={() => navigate("/testimonials")} className="group flex items-baseline gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-mint">Next</span>
          <span
            style={{ fontFamily: "var(--font-clash)" }}
            className="text-[clamp(22px,3vw,38px)] font-semibold uppercase tracking-tight text-peach transition-transform duration-300 group-hover:translate-x-2"
          >
            Testimonials
          </span>
        </button>
      </div>
    </main>
  );
}
