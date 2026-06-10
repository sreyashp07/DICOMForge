"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { usePageTransition } from "@/components/ui/PageTransition";

const LINKS = [
  { href: "/", label: "The Forge", index: "01" },
  { href: "/technology", label: "Technology", index: "02" },
  { href: "/insights", label: "Insights", index: "03" },
  { href: "/faq", label: "FAQ", index: "04" },
  { href: "/access", label: "Access", index: "05" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const { navigate } = usePageTransition();
  const pathname = usePathname();

  const go = (href: string) => {
    setOpen(false);
    setHovered(null);
    navigate(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="fixed right-[clamp(20px,5vw,64px)] top-6 z-[9600] flex h-11 w-11 items-center justify-center"
      >
        <span className="relative block h-4 w-7">
          <motion.span
            animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="absolute left-0 top-0 block h-[2px] w-full bg-peach"
          />
          <motion.span
            animate={
              open ? { rotate: -45, y: -7, width: "100%" } : { rotate: 0, y: 0, width: "70%" }
            }
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="absolute bottom-0 right-0 block h-[2px] bg-peach"
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.15 } }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[9500] flex items-center"
            style={{
              backgroundColor: "rgba(11, 12, 14, 0.9)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="hidden flex-1 items-center justify-center md:flex"
              aria-hidden="true"
            >
              <motion.svg
                width="min(30vw, 340px)"
                viewBox="0 0 380 260"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <defs>
                  <filter id="dfGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="10" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g transform="translate(24 0) skewX(-12)" filter="url(#dfGlow)">
                  <path
                    d="M40 30 L160 30 L198 72 L198 188 L160 230 L40 230 Z M92 78 L148 78 L156 88 L156 172 L148 182 L92 182 Z"
                    fill="var(--color-peach)"
                    fillRule="evenodd"
                  />
                  <path
                    d="M214 30 L348 30 L336 76 L266 76 L266 112 L330 112 L319 156 L266 156 L266 230 L214 230 Z"
                    fill="var(--color-mint)"
                  />
                </g>
              </motion.svg>
            </motion.div>

            <nav className="flex flex-1 flex-col gap-1 px-[clamp(20px,6vw,80px)]">
              {LINKS.map((link, i) => {
                const active = pathname === link.href;
                const dim = hovered !== null && hovered !== i;
                return (
                  <motion.button
                    key={link.href}
                    onClick={() => go(link.href)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    initial={{ opacity: 0, y: 34 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16, transition: { duration: 0.2, delay: 0 } }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group flex items-baseline gap-4 text-left"
                  >
                    <span className="text-[10px] tracking-[0.3em] text-mint">
                      {link.index}
                    </span>
                    <motion.span
                      animate={{ opacity: dim ? 0.22 : 1, x: hovered === i ? 14 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      style={{ fontFamily: "var(--font-clash)" }}
                      className={`text-[clamp(34px,6vw,72px)] font-semibold uppercase leading-[1.12] tracking-tight ${
                        active ? "text-mint" : "text-peach"
                      }`}
                    >
                      {link.label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
