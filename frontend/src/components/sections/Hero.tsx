"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";

const BADGES = [
  { label: "Volumetric pipeline", detail: "40-slice DICOM intake", x: "6%", y: "22%", dur: 7.5, tilt: -2.5, delay: 1.0 },
  { label: "Isosurface core", detail: "Marching cubes extraction", x: "70%", y: "16%", dur: 8.8, tilt: 2, delay: 1.25 },
  { label: "Zero-disk export", detail: "Binary STL streamed in-memory", x: "63%", y: "60%", dur: 8.1, tilt: -1.5, delay: 1.5 },
];

function Tick({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute h-2 w-2 border-mint/70 ${className}`} />;
}

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const beamRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    beamRef.current = gsap.fromTo(
      titleRef.current,
      { backgroundPosition: "215% 50%" },
      {
        backgroundPosition: "-115% 50%",
        duration: 4.6,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 2.4,
      }
    );
    return () => {
      beamRef.current?.kill();
    };
  }, []);

  const speedUp = () => beamRef.current && gsap.to(beamRef.current, { timeScale: 2.4, duration: 0.5 });
  const slowDown = () => beamRef.current && gsap.to(beamRef.current, { timeScale: 1, duration: 0.9 });

  return (
    <section className="relative z-10 flex min-h-dvh flex-col px-[clamp(20px,5vw,64px)]">
      <header className="flex items-center justify-between pt-7 text-[11px] uppercase tracking-[0.35em] text-mint">
        <span style={{ fontFamily: "var(--font-syne)" }} className="text-sm font-extrabold tracking-[0.2em] text-peach">
          DF
        </span>
      </header>

      <div className="relative flex flex-1 flex-col justify-end pb-[12vh]">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.label}
            aria-hidden="true"
            className="pointer-events-none absolute hidden md:block"
            style={{ left: b.x, top: b.y }}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: b.delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{
                y: [0, -14, 0, 11, 0],
                x: [0, 6, 0, -5, 0],
                rotate: [b.tilt, -b.tilt, b.tilt],
              }}
              transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
              className="relative border border-peach/15 bg-surface/55 px-5 py-4 backdrop-blur-md"
            >
              <Tick className="left-0 top-0 border-l border-t" />
              <Tick className="right-0 top-0 border-r border-t" />
              <Tick className="bottom-0 left-0 border-b border-l" />
              <Tick className="bottom-0 right-0 border-b border-r" />

              <div className="flex items-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-mint" />
                </span>
                <p className="text-[10px] uppercase tracking-[0.3em] text-mint">{b.label}</p>
              </div>
              <p className="mt-2 text-xs tracking-wide text-peach/85">{b.detail}</p>
              <span
                aria-hidden="true"
                className="mt-3 block h-px w-full"
                style={{ background: "linear-gradient(90deg, var(--color-mint), transparent 70%)" }}
              />
              <p className="mt-1.5 text-[9px] tracking-[0.4em] text-peach/30">DF-{String(i + 1).padStart(2, "0")}</p>
            </motion.div>
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 max-w-xs text-[11px] uppercase leading-relaxed tracking-[0.3em] text-mint"
        >
          DICOM series in. Surgical-grade 3D mesh out.
        </motion.p>

        <motion.h1
          ref={titleRef}
          onMouseEnter={speedUp}
          onMouseLeave={slowDown}
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "var(--font-clash)",
            backgroundImage:
              "linear-gradient(105deg, #E8AE8C 0%, #E8AE8C 40%, #FFF6EE 50%, #BFE7D2 54%, #E8AE8C 64%, #E8AE8C 100%)",
            backgroundSize: "240% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 0 70px rgba(243,191,163,0.18)",
          }}
          className="select-none text-[clamp(54px,12.5vw,176px)] font-semibold uppercase leading-[0.92] tracking-tight"
        >
          Dicom
          <br />
          Forge
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-peach/50"
        >
          <span className="h-px w-14 bg-peach/30" />
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
}
