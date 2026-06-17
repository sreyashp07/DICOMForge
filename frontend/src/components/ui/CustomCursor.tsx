"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const noHover = window.matchMedia("(hover: none)").matches;
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (coarse || noHover || touch) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let raf = 0;

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      }
    };

    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" style={{ mixBlendMode: "difference" }}>
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 34,
          height: 34,
          marginLeft: -17,
          marginTop: -17,
          borderRadius: 9999,
          border: "1px solid rgba(243,191,163,0.7)",
          background:
            "radial-gradient(circle, rgba(169,217,192,0.10), transparent 70%)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: 9999,
          backgroundColor: "var(--color-peach-bloom)",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </div>
  );
}
