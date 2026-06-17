"use client";

import { usePageTransition } from "@/components/ui/PageTransition";

export default function DFLogo() {
  const { navigate } = usePageTransition();
  return (
    <button
      onClick={() => navigate("/")}
      aria-label="DicomForge home"
      className="fixed left-[clamp(16px,5vw,64px)] top-6 z-[9600]"
      style={{ fontFamily: "var(--font-syne)" }}
    >
      <span className="text-sm font-extrabold tracking-[0.2em] text-peach transition-colors duration-300 hover:text-mint">
        DF
      </span>
    </button>
  );
}
