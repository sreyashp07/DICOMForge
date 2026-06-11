"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePageTransition } from "@/components/ui/PageTransition";
import ScrambleText from "@/components/ui/ScrambleText";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const { navigate } = usePageTransition();

  useEffect(() => {
    if (!loading && !user) navigate("/access");
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-ink">
        <p
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[11px] uppercase tracking-[0.5em] text-mint"
        >
          <ScrambleText text="Authorising" autoStart framesPerChar={6} />
        </p>
      </main>
    );
  }

  return <>{children}</>;
}
