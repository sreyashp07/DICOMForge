"use client";

import { useState } from "react";
import Loader from "@/components/loader/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink text-peach">
      <section
        style={{ opacity: loading ? 0 : 1, transition: "opacity 0.9s ease 0.05s" }}
        className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center"
      >
        <h1
          style={{ fontFamily: "var(--font-syne)" }}
          className="text-4xl font-bold uppercase tracking-[0.4em] sm:text-6xl"
        >
          Dicom Forge
        </h1>
        <p className="max-w-md text-xs uppercase tracking-[0.2em] text-mint">
          DICOM to 3D STL
        </p>
      </section>

      <Loader onComplete={() => setLoading(false)} />
    </main>
  );
}