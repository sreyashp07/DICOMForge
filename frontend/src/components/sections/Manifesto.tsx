"use client";

import { motion } from "motion/react";
import MediaFrame from "@/components/ui/MediaFrame";
import { usePageTransition } from "@/components/ui/PageTransition";

const LINES = [
  "DicomForge turns raw DICOM series",
  "into surgical-grade 3D geometry.",
  "No machine-learning black box.",
  "Pure deterministic structure,",
  "forged entirely in memory.",
];

export default function Manifesto() {
  const { navigate } = usePageTransition();

  return (
    <section className="relative z-10 px-[clamp(20px,5vw,64px)] pb-[16vh] pt-[10vh]">
      <p className="mb-10 text-[10px] uppercase tracking-[0.5em] text-mint">What is DicomForge</p>

      <div className="max-w-4xl">
        {LINES.map((line, i) => (
          <div key={line} className="overflow-hidden">
            <motion.p
              initial={{ y: "110%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "var(--font-clash)" }}
              className="text-[clamp(26px,4.6vw,58px)] font-medium uppercase leading-[1.08] tracking-tight text-peach"
            >
              {line}
            </motion.p>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 md:ml-[28%]"
      >
        <MediaFrame
          alt="DicomForge hero visual of a 3D mesh forged from CT slices"
          label="Asset 01 - Landing visual"
          note="1600 x 1000 - dark render, mesh emerging from slices"
          ratio="16 / 10"
        />
      </motion.div>

      <div className="mt-16 flex justify-end">
        <button
          onClick={() => navigate("/technology")}
          className="group flex items-baseline gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-mint">Next</span>
          <span
            style={{ fontFamily: "var(--font-clash)" }}
            className="text-[clamp(22px,3vw,38px)] font-semibold uppercase tracking-tight text-peach transition-transform duration-300 group-hover:translate-x-2"
          >
            What we do
          </span>
        </button>
      </div>
    </section>
  );
}
