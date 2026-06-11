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
  const wordFillRef = useRef<HTMLSpanElement>(null);
  const strikeRef = useRef<SVGSVGElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let active = true;

    const finish = async (fast = false) => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete();
      if (scope.current) {
        try {
          await animate(scope.current, { opacity: 0 }, { duration: fast ? 0.25 : 0.95, ease: "easeInOut" });
        } catch {}
      }
      if (active) setHidden(true);
    };

    const fallback = setTimeout(() => finish(true), 9000);

    const run = async () => {
      try {
        if (typeof document !== "undefined" && document.fonts?.ready) {
          await document.fonts.ready;
        }
      } catch {}
      if (!active || !scope.current) return;

      if (prefersReduced) {
        await finish(true);
        return;
      }

      const intro: AnimationSequence = [
        ["[data-d]", { x: [-110, 0], opacity: [0, 1] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] }],
        ["[data-f]", { x: [110, 0], opacity: [0, 1] }, { duration: 0.6, ease: [0.22, 1, 0.36, 1], at: "-0.45" }],
        ["[data-slash]", { strokeDashoffset: 0 }, { duration: 0.5, ease: "easeInOut", at: "-0.15" }],
        ["[data-mono]", { opacity: 0, scale: 0.92 }, { duration: 0.4, ease: "easeIn", at: "+0.5" }],
        ["[data-word]", { opacity: 1 }, { duration: 0.35, at: "-0.1" }],
      ];

      try {
        await animate(intro);
      } catch {}
      if (!active) return;

      const progress = animateValue(0, 100, {
        duration: 2.1,
        ease: "easeInOut",
        onUpdate: (v) => {
          const n = Math.round(v);
          if (numRef.current) numRef.current.textContent = String(n).padStart(3, "0");
          if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / 100})`;
          if (wordFillRef.current) wordFillRef.current.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
          if (strikeRef.current) strikeRef.current.style.opacity = String(1 - (v / 100) * 0.85);
        },
      });

      try {
        await progress;
      } catch {}
      if (!active) return;

      const outro: AnimationSequence = [
        ["[data-word]", { opacity: 0, scale: 0.1 }, { duration: 0.45, ease: "easeIn" }],
        ["[data-dot]", { opacity: 1, scale: 1 }, { duration: 0.3, ease: "easeOut", at: "<" }],
        ["[data-dot]", { scale: 1.5 }, { duration: 0.25, ease: "easeOut" }],
        ["[data-meter]", { opacity: 0 }, { duration: 0.4, at: "+0.05" }],
        ["[data-bloom]", { opacity: [0, 0.9], scale: 46 }, { duration: 1.1, ease: [0.45, 0, 0.2, 1], at: "<" }],
        ["[data-dot]", { opacity: 0 }, { duration: 0.2, at: "<" }],
      ];

      try {
        await animate(outro);
      } catch {}
      if (active) await finish();
    };

    run();

    return () => {
      active = false;
      clearTimeout(fallback);
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
        <svg
          data-mono
          width="min(64vw, 420px)"
          viewBox="0 0 380 260"
          style={{ gridArea: "1 / 1", overflow: "visible" }}
        >
          <g transform="translate(24 0) skewX(-12)">
            <g data-d style={{ opacity: 0 }}>
              <path
                d="M40 30 L160 30 L198 72 L198 188 L160 230 L40 230 Z M92 78 L148 78 L156 88 L156 172 L148 182 L92 182 Z"
                fill="var(--color-peach)"
                fillRule="evenodd"
              />
            </g>
            <g data-f style={{ opacity: 0 }}>
              <path
                d="M214 30 L348 30 L336 76 L266 76 L266 112 L330 112 L319 156 L266 156 L266 230 L214 230 Z"
                fill="var(--color-peach)"
              />
            </g>
          </g>
          <line
            data-slash
            x1="6"
            y1="206"
            x2="374"
            y2="54"
            stroke="var(--color-mint)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ strokeDasharray: 400, strokeDashoffset: 400 }}
          />
        </svg>

        <div
          data-word
          style={{
            gridArea: "1 / 1",
            position: "relative",
            opacity: 0,
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(26px, 6vw, 52px)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "rgba(243, 191, 163, 0.18)" }}>Dicomforge</span>
          <span
            ref={wordFillRef}
            style={{
              position: "absolute",
              inset: 0,
              color: "var(--color-peach)",
              clipPath: "inset(0 100% 0 0)",
            }}
          >
            Dicomforge
          </span>
          <svg
            ref={strikeRef}
            aria-hidden="true"
            viewBox="0 0 400 30"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              left: "-5%",
              right: "-5%",
              top: "50%",
              width: "110%",
              height: 30,
              transform: "translateY(-50%) rotate(-4deg)",
              overflow: "visible",
              opacity: 1,
            }}
          >
            <path
              d="M4 17 Q 20 8 36 15 T 68 14 T 100 17 T 132 13 T 164 16 T 196 14 T 228 17 T 260 13 T 292 16 T 324 14 T 356 17 T 392 14"
              fill="none"
              stroke="var(--color-mint)"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <path
              d="M6 19 Q 22 11 38 17 T 70 16 T 102 19 T 134 15 T 166 18 T 198 16 T 230 19 T 262 15 T 294 18 T 326 16 T 358 19 T 390 16"
              fill="none"
              stroke="var(--color-mint)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
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
            "radial-gradient(circle, rgba(252,230,214,0.92) 0%, rgba(243,191,163,0.85) 32%, rgba(169,217,192,0.7) 64%, rgba(111,184,154,0) 100%)",
        }}
      />
    </div>
  );
}