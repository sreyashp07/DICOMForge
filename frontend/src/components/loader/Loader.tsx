"use client";

import { useEffect, useRef, useState } from "react";
import {
  useAnimate,
  useReducedMotion,
  animate as animateValue,
  type AnimationSequence,
} from "motion/react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [scope, animate] = useAnimate();
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    const fallback = setTimeout(() => {
      if (!active) return;
      onComplete();
      setHidden(true);
    }, 6500);

    const run = async () => {
      try {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {}
      if (!active) return;

      const overlay = scope.current;
      if (!overlay) return;

      if (prefersReduced) {
        onComplete();
        await animate(overlay, { opacity: [1, 0] }, { duration: 0.4 });
        if (active) setHidden(true);
        return;
      }

      animateValue(0, 100, {
        duration: 3.2,
        ease: "easeInOut",
        onUpdate: (v) => {
          const n = Math.round(v);
          if (numRef.current) numRef.current.textContent = String(n).padStart(3, "0");
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / 100})`;
        },
      });

      const intro: AnimationSequence = [
        ["[data-d]", { opacity: 1, y: [14, 0] }, { duration: 0.5, ease: "easeOut" }],
        ["[data-f]", { opacity: 1, y: [14, 0] }, { duration: 0.5, ease: "easeOut", at: "-0.34" }],
        ["[data-slash]", { strokeDashoffset: 0 }, { duration: 0.55, ease: "easeInOut", at: "-0.2" }],
        ["[data-df]", { opacity: 0, scale: 1.06 }, { duration: 0.4, ease: "easeIn", at: "+0.4" }],
        ["[data-slash]", { opacity: 0 }, { duration: 0.25, at: "<" }],
        ["[data-full]", { opacity: 1, letterSpacing: "0.5em" }, { duration: 0.75, ease: "easeOut", at: "<" }],
        ["[data-full]", { opacity: 0, scale: 0.12 }, { duration: 0.45, ease: "easeIn", at: "+0.55" }],
        ["[data-dot]", { opacity: 1, scale: 1 }, { duration: 0.3, ease: "easeOut", at: "<" }],
        ["[data-dot]", { scale: 1.5 }, { duration: 0.25, ease: "easeOut" }],
        ["[data-meter]", { opacity: 0 }, { duration: 0.4, at: "+0.05" }],
        ["[data-bloom]", { opacity: 1, scale: 64 }, { duration: 0.85, ease: "easeIn", at: "<" }],
        ["[data-dot]", { opacity: 0 }, { duration: 0.2, at: "<" }],
      ];

      const controls = animate(intro);
      controlsRef.current = controls;
      try {
        await controls;
      } catch {}
      if (!active) return;

      onComplete();
      await animate(overlay, { opacity: 0 }, { duration: 0.6, ease: "easeInOut" });
      if (active) setHidden(true);
    };

    run();

    return () => {
      active = false;
      clearTimeout(fallback);
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted || hidden) return null;

  return (
    <div
      ref={scope}
      role="status"
      aria-label="Loading DicomForge"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "grid",
        placeItems: "center",
        backgroundColor: "var(--color-ink)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", display: "grid", placeItems: "center" }} aria-hidden="true">
        <div
          data-df
          style={{
            gridArea: "1 / 1",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.02em",
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(56px, 12vw, 104px)",
            letterSpacing: "0.04em",
            color: "var(--color-peach)",
            lineHeight: 1,
          }}
        >
          <span data-d style={{ opacity: 0, display: "inline-block" }}>D</span>
          <span data-f style={{ opacity: 0, display: "inline-block" }}>F</span>

          <svg
            width="240"
            height="170"
            viewBox="0 0 240 170"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, margin: "auto", pointerEvents: "none", overflow: "visible" }}
          >
            <line
              data-slash
              x1="24"
              y1="136"
              x2="216"
              y2="34"
              stroke="var(--color-peach)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ strokeDasharray: 240, strokeDashoffset: 240 }}
            />
          </svg>
        </div>

        <div
          data-full
          style={{
            gridArea: "1 / 1",
            opacity: 0,
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: "clamp(20px, 4.5vw, 34px)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--color-peach)",
            whiteSpace: "nowrap",
          }}
        >
          Dicom Forge
        </div>

        <span
          data-dot
          style={{
            gridArea: "1 / 1",
            width: 14,
            height: 14,
            borderRadius: 9999,
            backgroundColor: "var(--color-peach-bloom)",
            opacity: 0,
            transform: "scale(0)",
          }}
        />
      </div>

      <div
        data-meter
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "0 clamp(20px, 5vw, 64px) clamp(22px, 4vh, 40px)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: "var(--font-space)",
            fontSize: 11,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--color-mint)",
          }}
        >
          <span ref={numRef}>000</span>
          <span>Loading</span>
        </div>
        <div style={{ height: 1, width: "100%", backgroundColor: "rgba(243,191,163,0.18)", overflow: "hidden" }}>
          <div
            ref={fillRef}
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "var(--color-peach)",
              transform: "scaleX(0)",
              transformOrigin: "left center",
            }}
          />
        </div>
      </div>

      <div
        data-bloom
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 80,
          height: 80,
          borderRadius: 9999,
          opacity: 0,
          transform: "scale(0)",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, #FFF3E9 0%, var(--color-peach-bloom) 20%, var(--color-peach) 44%, var(--color-mint) 72%, var(--color-mint-deep) 100%)",
        }}
      />
    </div>
  );
}