"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";

type Stage = "idle" | "cover" | "reveal";

const TransitionContext = createContext<{
  navigate: (href: string) => void;
  stage: Stage;
}>({ navigate: () => {}, stage: "idle" });

export const usePageTransition = () => useContext(TransitionContext);

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");
  const pending = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || stage !== "idle") return;
      pending.current = href;
      setStage("cover");
    },
    [pathname, stage]
  );

  useEffect(() => {
    if (stage === "cover" && pending.current && pathname === pending.current) {
      pending.current = null;
      window.__lenis?.scrollTo(0, { immediate: true });
      const t = setTimeout(() => setStage("reveal"), 160);
      return () => clearTimeout(t);
    }
  }, [pathname, stage]);

  const variants = {
    idle: { y: "135%", rotate: 9 },
    cover: { y: "0%", rotate: 0 },
    reveal: { y: "-135%", rotate: -7 },
  };

  return (
    <TransitionContext.Provider value={{ navigate, stage }}>
      {children}
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={stage}
        variants={variants}
        transition={
          stage === "idle"
            ? { duration: 0 }
            : {
                duration: stage === "cover" ? 0.65 : 0.8,
                ease: [0.76, 0, 0.24, 1],
              }
        }
        onAnimationComplete={(definition) => {
          if (definition === "cover" && pending.current) {
            router.push(pending.current);
          } else if (definition === "reveal") {
            setStage("idle");
          }
        }}
        style={{
          position: "fixed",
          left: "-15vw",
          top: "-15vh",
          width: "130vw",
          height: "130vh",
          zIndex: 9000,
          backgroundColor: "var(--color-surface)",
          pointerEvents: stage === "idle" ? "none" : "auto",
          display: "grid",
          placeItems: "center",
          borderTop: "1px solid rgba(169,217,192,0.2)",
          boxShadow: "0 -24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <span
          style={{ fontFamily: "var(--font-clash)" }}
          className="select-none text-[20vw] font-semibold uppercase leading-none text-peach/[0.05]"
        >
          DF
        </span>
      </motion.div>
    </TransitionContext.Provider>
  );
}
