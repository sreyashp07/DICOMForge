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

const PANELS = 5;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");
  const pendingRef = useRef<string | null>(null);
  const coverCount = useRef(0);
  const revealCount = useRef(0);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || stage !== "idle") return;
      pendingRef.current = href;
      coverCount.current = 0;
      setStage("cover");
    },
    [pathname, stage]
  );

  useEffect(() => {
    if (stage === "cover" && pendingRef.current === null) return;
    if (stage === "cover" && pathname === pendingRef.current) {
      pendingRef.current = null;
      revealCount.current = 0;
      const t = setTimeout(() => setStage("reveal"), 140);
      return () => clearTimeout(t);
    }
  }, [pathname, stage]);

  const onPanelDone = () => {
    if (stage === "cover") {
      coverCount.current += 1;
      if (coverCount.current === PANELS && pendingRef.current) {
        router.push(pendingRef.current);
      }
    } else if (stage === "reveal") {
      revealCount.current += 1;
      if (revealCount.current === PANELS) setStage("idle");
    }
  };

  return (
    <TransitionContext.Provider value={{ navigate, stage }}>
      {children}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9000,
          display: "flex",
          pointerEvents: stage === "idle" ? "none" : "auto",
        }}
      >
        {Array.from({ length: PANELS }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ scaleY: stage === "cover" ? 1 : 0 }}
            transition={
              stage === "idle"
                ? { duration: 0 }
                : {
                    duration: stage === "cover" ? 0.5 : 0.6,
                    ease: [0.76, 0, 0.24, 1],
                    delay: i * 0.07,
                  }
            }
            onAnimationComplete={onPanelDone}
            style={{
              flex: 1,
              backgroundColor: "var(--color-surface)",
              transformOrigin:
                stage === "reveal" ? "center bottom" : "center top",
              boxShadow: "inset 0 1px 0 rgba(169,217,192,0.10)",
            }}
          />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}