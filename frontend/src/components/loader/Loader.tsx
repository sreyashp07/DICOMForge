"use client";

import { useEffect, useRef } from "react";
import {
  useAnimate,
  useReducedMotion,
  type AnimationSequence,
} from "motion/react";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [scope, animate] = useAnimate();
  const prefersReduced = useReducedMotion();
  const finishedRef = useRef(false);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    let active = true;
    const fallback = setTimeout(finish, 5000);

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
        const c = animate(overlay, { opacity: [1, 0] }, { duration: 0.4 });
        controlsRef.current = c;
        try {
          await c;
        } catch {}
        finish();
        return;
      }

      const sequence: AnimationSequence = [
        ["[data-df]", { opacity: 1 }, { duration: 0.55, ease: "easeOut" }],
        ["[data-slash]", { strokeDashoffset: 0 }, { duration: 0.5, ease: "easeInOut", at: "-0.25" }],
        ["[data-df]", { opacity: 0, scale: 1.06 }, { duration: 0.35, ease: "easeIn", at: "+0.35" }],
        ["[data-slash]", { opacity: 0 }, { duration: 0.25, at: "<" }],
        ["[data-full]", { opacity: 1, letterSpacing: "0.5em" }, { duration: 0.7, ease: "easeOut", at: "<" }],
        ["[data-full]", { opacity: 0, scale: 0.12 }, { duration: 0.45, ease: "easeIn", at: "+0.5" }],
        ["[data-dot]", { opacity: 1, scale: 1 }, { duration: 0.3, ease: "easeOut", at: "<" }],
        ["[data-dot]", { scale: 1.5 }, { duration: 0.25, ease: "easeOut" }],
        ["[data-bloom]", { opacity: 1, scale: 64 }, { duration: 0.8, ease: "easeIn" }],
        ["[data-dot]", { opacity: 0 }, { duration: 0.2, at: "<" }],
        [overlay, { opacity: 0 }, { duration: 0.55, ease: "easeInOut", at: "+0.05" }],
      ];

      const controls = animate(sequence);
      controlsRef.current = controls;
      try {
        await controls;
      } catch {}
      if (active) finish();
    };

    run();

    return () => {
      active = false;
      clearTimeout(fallback);
      controlsRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSkip = () => {
    if (finishedRef.current) return;
    controlsRef.current?.stop();
    if (scope.current) animate(scope.current, { opacity: 0 }, { duration: 0.25 });
    setTimeout(finish, 280);
  };

  return (
    <div
      ref={scope}
      data-overlay
      onClick={handleSkip}
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
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
        <div
          data-df
          style={{
            gridArea: "1 / 1",
            position: "relative",
            opacity: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: "clamp(56px, 12vw, 96px)",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "var(--color-peach)",
              lineHeight: 1,
            }}
          >
            DF
          </span>
          <svg
            width="220"
            height="160"
            viewBox="0 0 220 160"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, margin: "auto", pointerEvents: "none", overflow: "visible" }}
          >
            <line
              data-slash
              x1="20"
              y1="128"
              x2="200"
              y2="32"
              stroke="var(--color-peach)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ strokeDasharray: 220, strokeDashoffset: 220 }}
            />
          </svg>
        </div>

        <div
          data-full
          style={{
            gridArea: "1 / 1",
            opacity: 0,
            letterSpacing: "0.15em",
            fontSize: "clamp(20px, 4.5vw, 34px)",
            fontWeight: 500,
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
        data-bloom
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