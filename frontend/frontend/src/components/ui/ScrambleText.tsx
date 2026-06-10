"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$<>/";

export default function ScrambleText({
  text,
  autoStart = false,
  delay = 0,
  scrambleOnHover = false,
  framesPerChar = 7,
  glyphHold = 5,
  className = "",
  style,
}: {
  text: string;
  autoStart?: boolean;
  delay?: number;
  scrambleOnHover?: boolean;
  framesPerChar?: number;
  glyphHold?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef(0);
  const frameRef = useRef(0);
  const glyphsRef = useRef<string[]>([]);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    frameRef.current = 0;
    glyphsRef.current = text
      .split("")
      .map((c) =>
        c === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      );

    const tick = () => {
      frameRef.current += 1;
      const resolved = Math.floor(frameRef.current / framesPerChar);

      if (frameRef.current % glyphHold === 0) {
        for (let i = resolved; i < text.length; i++) {
          if (text[i] !== " ") {
            glyphsRef.current[i] =
              GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
      }

      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
        } else if (i < resolved) {
          out += text[i];
        } else {
          out += glyphsRef.current[i];
        }
      }
      setDisplay(out);

      if (resolved < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [text, framesPerChar, glyphHold]);

  useEffect(() => {
    if (!autoStart) return;
    const t = setTimeout(run, delay * 1000);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafRef.current);
    };
  }, [autoStart, delay, run]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span
      className={className}
      style={style}
      onMouseEnter={scrambleOnHover ? run : undefined}
    >
      {display}
    </span>
  );
}
