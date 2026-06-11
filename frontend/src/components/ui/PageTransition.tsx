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
const STRIPES = 5;

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
  const coverCount = useRef(0);
  const revealCount = useRef(0);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname || stage !== "idle") return;
      pending.current = href;
      coverCount.current = 0;
      setStage("cover");
    },
    [pathname, stage]
  );

  useEffect(() => {
    if (stage === "cover" && pending.current && pathname === pending.current) {
      pending.current = null;
      window.__lenis?.scrollTo(0, { immediate: true });
      revealCount.current = 0;
      const t = setTimeout(() => setStage("reveal"), 160);
      return () => clearTimeout(t);
    }
  }, [pathname, stage]);

  useEffect(() => {
    if (failsafe.current) clearTimeout(failsafe.current);
    if (stage === "cover") {
      failsafe.current = setTimeout(() => {
        setStage((s) => (s === "cover" ? "reveal" : s));
      }, 4000);
    }
    return () => {
      if (failsafe.current) clearTimeout(failsafe.current);
    };
  }, [stage]);

  const onStripeDone = () => {
    if (stage === "cover") {
      coverCount.current += 1;
      if (coverCount.current === STRIPES && pending.current) {
        router.push(pending.current);
      }
    } else if (stage === "reveal") {
      revealCount.current += 1;
      if (revealCount.current === STRIPES) setStage("idle");
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
          zIndex: 9800,
          display: "flex",
          flexDirection: "column",
          pointerEvents: stage === "idle" ? "none" : "auto",
        }}
      >
        {Array.from({ length: STRIPES }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ scaleX: stage === "cover" ? 1 : 0 }}
            transition={
              stage === "idle"
                ? { duration: 0 }
                : {
                    duration: stage === "cover" ? 0.55 : 0.65,
                    ease: [0.76, 0, 0.24, 1],
                    delay: i * 0.07,
                  }
            }
            onAnimationComplete={onStripeDone}
            style={{
              flex: 1,
              width: "100%",
              backgroundColor: "var(--color-surface)",
              transformOrigin: stage === "reveal" ? "right center" : "left center",
              boxShadow: "inset 0 1px 0 rgba(169,217,192,0.08)",
            }}
          />
        ))}
        <motion.span
          initial={false}
          animate={{ opacity: stage === "cover" ? 0.05 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-clash)",
            pointerEvents: "none",
          }}
          className="text-[20vw] font-semibold uppercase leading-none text-peach"
        >
          DF
        </motion.span>
      </div>
    </TransitionContext.Provider>
  );
}
