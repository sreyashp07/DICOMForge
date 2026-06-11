"use client";

import { motion } from "motion/react";
import MediaFrame from "@/components/ui/MediaFrame";
import { usePageTransition } from "@/components/ui/PageTransition";

function HoverWords({ text, className = "" }: { text: string; className?: string }) {
  return (
    <p className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block cursor-default transition-all duration-300 ease-out hover:-translate-y-[2px] hover:text-mint"
        >
          {word}
          {"\u00A0"}
        </span>
      ))}
    </p>
  );
}

const PARA_1 =
  "DicomForge is a precision instrument for medical imaging. It takes the flat grayscale slices of a CT or MRI series and forges them into a single accurate three-dimensional mesh that a clinician can rotate, section, measure and print.";

const PARA_2 =
  "There is no machine-learning guesswork inside. Every surface is reconstructed deterministically, with adaptive contrast enhancement and the marching cubes algorithm, entirely in memory. The same scan always produces the same trustworthy geometry, and nothing is ever written to disk.";

const PARA_3 =
  "The result is structure a person can hold. A fracture stops being thirty separate frames and becomes one object, turned in the hand of the surgeon who has to repair it. Depth, scale and relation, restored to imaging that always had them but could never show them.";

export default function Manifesto() {
  const { navigate } = usePageTransition();

  return (
    <section className="relative z-10 px-[clamp(20px,5vw,64px)] pb-[16vh] pt-[12vh]">
      <p className="mb-10 text-[10px] uppercase tracking-[0.5em] text-mint">What is DicomForge</p>

      <motion.h2
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontFamily: "var(--font-clash)" }}
        className="max-w-3xl text-[clamp(30px,5vw,64px)] font-medium uppercase leading-[1.05] tracking-tight text-peach"
      >
        Slices in.
        <br />
        Structure out.
      </motion.h2>

      <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <HoverWords
            text={PARA_1}
            className="text-[clamp(15px,1.4vw,19px)] leading-[1.9] tracking-wide text-peach/70"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <HoverWords
            text={PARA_2}
            className="text-[clamp(15px,1.4vw,19px)] leading-[1.9] tracking-wide text-peach/70"
          />
        </motion.div>
      </div>

      <div className="mt-20 grid grid-cols-1 items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-6 text-[10px] uppercase tracking-[0.5em] text-mint">Why it matters</p>
          <HoverWords
            text={PARA_3}
            className="text-[clamp(15px,1.4vw,19px)] leading-[1.9] tracking-wide text-peach/70"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <MediaFrame
            src="/images/landing-visual.jpg"
            alt="DicomForge hero visual of a 3D mesh forged from CT slices"
            label="Asset 01 - Landing visual"
            note="1600 x 1000"
            ratio="16 / 10"
            className="border border-peach/15"
          />
        </motion.div>
      </div>

      <div className="mt-16 flex justify-end">
        <button onClick={() => navigate("/technology")} className="group flex items-baseline gap-4">
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
