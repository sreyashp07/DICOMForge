"use client";

import { useRef, useState } from "react";
import ScrambleText from "@/components/ui/ScrambleText";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$<>/";

export default function DecryptField({
  label,
  type = "text",
  value,
  onChange,
  delay = 0,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  delay?: number;
  autoComplete?: string;
}) {
  const [focus, setFocus] = useState(false);
  const [show, setShow] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null);
  const decryptedRef = useRef(false);
  const rafRef = useRef(0);

  const isPassword = type === "password";
  const lifted = focus || value.length > 0;

  const runDecrypt = () => {
    if (decryptedRef.current || !value) return;
    decryptedRef.current = true;
    const target = isPassword && !show ? "\u2022".repeat(value.length) : value;
    let frame = 0;
    const tick = () => {
      frame += 1;
      const resolved = Math.floor(frame / 2);
      let out = "";
      for (let i = 0; i < target.length; i++) {
        out +=
          i < resolved
            ? target[i]
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOverlay(out);
      if (resolved < target.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setOverlay(null), 140);
      }
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="relative pt-6">
      <span
        className="pointer-events-none absolute left-0 uppercase transition-all duration-300 ease-out"
        style={{
          top: lifted ? 0 : 26,
          fontSize: lifted ? 9 : 12,
          letterSpacing: "0.35em",
          color: lifted ? "var(--color-mint)" : "rgba(243,191,163,0.45)",
        }}
      >
        <ScrambleText text={label} autoStart delay={delay} framesPerChar={6} />
      </span>

      <div className="relative">
        <input
          type={isPassword && !show ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setFocus(false);
            runDecrypt();
          }}
          autoComplete={autoComplete}
          spellCheck={false}
          className="w-full bg-transparent py-2.5 pr-14 text-sm outline-none"
          style={{
            fontFamily: "var(--font-space)",
            letterSpacing: "0.18em",
            color: overlay ? "transparent" : "var(--color-peach)",
            caretColor: "var(--color-mint)",
          }}
        />
        {overlay && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center py-2.5 text-sm"
            style={{
              fontFamily: "var(--font-space)",
              letterSpacing: "0.18em",
              color: "var(--color-mint)",
            }}
          >
            {overlay}
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-[0.3em] text-peach/40 transition-colors duration-300 hover:text-mint"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>

      <div className="h-px w-full bg-peach/15">
        <div
          className="h-full origin-left bg-mint transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${focus ? 1 : 0})` }}
        />
      </div>
    </div>
  );
}
