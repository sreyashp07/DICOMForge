"use client";

import { useState } from "react";
import Loader from "@/components/loader/Loader";

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-ink text-peach">
      <section className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-medium uppercase tracking-[0.45em] sm:text-5xl">
          Dicom Forge
        </h1>
        <p className="max-w-md text-sm tracking-wide text-mint">
          DICOM to 3D STL. Landing page arrives in Phase 3.
        </p>
      </section>

      {loading && <Loader onComplete={() => setLoading(false)} />}
    </main>
  );
}