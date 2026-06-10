"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { motion } from "motion/react";

const BADGES = [
  { label: "Volumetric pipeline", detail: "40-slice DICOM intake", x: "6%", y: "24%", dur: 6.5 },
  { label: "Isosurface core", detail: "Marching cubes extraction", x: "70%", y: "18%", dur: 7.8 },
  { label: "Zero-disk export", detail: "Binary STL streamed in-memory", x: "64%", y: "62%", dur: 7.1 },
];

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
        {BADGES.map((b) => (
          <motion.div
            key={b.label}
            aria-hidden="true"
            className="pointer-events-none absolute hidden border border-peach/15 bg-surface/60 px-4 py-3 backdrop-blur-sm md:block"
            style={{ left: b.x, top: b.y }}
            animate={{ y: [0, -12, 0, 10, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-mint">{b.label}</p>
            <p className="mt-1 text-xs tracking-wide text-peach/80">{b.detail}</p>
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
