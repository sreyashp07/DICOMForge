"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/loader/Loader";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";

const FerrofluidCanvas = dynamic(
  () => import("@/components/canvas/FerrofluidCanvas"),
  { ssr: false }
);

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-ink text-peach">
      {!loading && <FerrofluidCanvas />}

      <div style={{ opacity: loading ? 0 : 1, transition: "opacity 0.9s ease 0.05s" }}>
        <Hero />
        <Manifesto />
      </div>

      <Loader onComplete={() => setLoading(false)} />
    </main>
  );
}
