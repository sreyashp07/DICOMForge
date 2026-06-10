"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";
import { usePageTransition } from "@/components/ui/PageTransition";

const FAQS = [
  { q: "What exactly does DicomForge do?", a: "It converts a series of 2D DICOM slices, the standard format for CT and MRI exports, into a single accurate 3D STL mesh. Upload the series, and the forge parses, enhances, extracts and streams the model back to your browser." },
  { q: "Why is there a 40-slice limit?", a: "DicomForge runs on a deliberately lightweight deployment with a strict memory ceiling. Capping intake at 40 slices guarantees every forge completes safely instead of failing midway. The cap is enforced both in the browser and on the server." },
  { q: "Is my medical data stored anywhere?", a: "No. The entire pipeline runs in memory. Slices are parsed, processed and discarded; the STL is streamed back without ever being written to disk. Nothing about your imaging persists after the response is sent." },
  { q: "How accurate is the output mesh?", a: "Extraction uses the marching cubes algorithm, the established standard for isosurface reconstruction, on a CLAHE and gamma-enhanced volume. The result is deterministic: the same input always forges the same geometry, with no ML approximation." },
  { q: "Can I 3D print the result?", a: "Yes. The output is a watertight binary STL, the native input format for every mainstream slicer. Models forged here go straight to print for anatomical references, surgical guides and teaching aids." },
  { q: "Why does the first request sometimes take a minute?", a: "The forge sleeps when idle to stay lightweight. Your first visit wakes it, which can take thirty to sixty seconds; the interface shows a warming state while that happens. Every request after that is fast." },
  { q: "What file types are accepted?", a: "Standard DICOM files with the .dcm extension from CT or MRI series. The uploader validates format and slice count before anything is sent, so malformed series are caught instantly." },
  { q: "Do I need an account?", a: "Forging requires a free account so your generated models can be associated with you in the dashboard. Sign in with Google or email through the Access page." },
];

export default function FaqPage() {
  const { navigate } = usePageTransition();
  const [open, setOpen] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);
    if (next !== null) {
      setTimeout(() => {
        const el = itemRefs.current[i];
        if (!el) return;
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { offset: -110, duration: 1.1 });
        } else {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 120);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-ink px-[clamp(20px,5vw,64px)] pb-[14vh] text-peach">
      <section className="flex min-h-[58vh] flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mb-6 text-[10px] uppercase tracking-[0.5em] text-mint"
        >
          04 - FAQ
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[clamp(34px,6vw,84px)] font-light uppercase tracking-[0.25em]"
        >
          <ScrambleText text="Questions" autoStart delay={1.1} />
        </motion.h1>
      </section>

      <section className="mx-auto max-w-3xl">
        {FAQS.map((f, i) => (
          <div
            key={f.q}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="border-t border-peach/15"
          >
            <button
              onClick={() => toggle(i)}
              aria-expanded={open === i}
              className="group flex w-full items-baseline justify-between gap-6 py-8 text-left"
            >
              <span className="flex items-baseline gap-5">
                <span className="text-[10px] tracking-[0.4em] text-mint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  style={{ fontFamily: "var(--font-clash)" }}
                  className="text-[clamp(17px,2.2vw,26px)] font-medium uppercase tracking-tight transition-colors duration-300 group-hover:text-mint"
                >
                  {f.q}
                </span>
              </span>
              <motion.span
                animate={{ rotate: open === i ? 45 : 0 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                className="text-xl leading-none text-mint"
                aria-hidden="true"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-9 pl-[52px] text-sm leading-relaxed tracking-wide text-peach/60">
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
        <div className="border-t border-peach/15" />
      </section>

      <div className="mx-auto mt-[12vh] flex max-w-3xl justify-end">
        <button onClick={() => navigate("/access")} className="group flex items-baseline gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-mint">Next</span>
          <span
            style={{ fontFamily: "var(--font-clash)" }}
            className="text-[clamp(22px,3vw,38px)] font-semibold uppercase tracking-tight text-peach transition-transform duration-300 group-hover:translate-x-2"
          >
            Access
          </span>
        </button>
      </div>
    </main>
  );
}
