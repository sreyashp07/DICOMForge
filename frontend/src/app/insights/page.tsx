"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";
import MediaFrame from "@/components/ui/MediaFrame";
import { usePageTransition } from "@/components/ui/PageTransition";

const CASES = [
  {
    t: "Surgical Planning",
    d: "Pre-operative mapping on true patient geometry. Surgeons rotate, section and measure the forged mesh to rehearse approach vectors before the first incision.",
    label: "Asset 03 - Surgical planning visual",
    note: "1200 x 900 - OR planning or mesh inspection scene",
  },
  {
    t: "3D Bioprinting",
    d: "Watertight STL output drops straight into slicer software. Patient-specific anatomical models, surgical guides and implant prototypes without manual mesh repair.",
    label: "Asset 04 - Bioprinting visual",
    note: "1200 x 900 - printed anatomical model or printer bed",
  },
  {
    t: "Radiological Depth",
    d: "CLAHE-enhanced volumes reveal density gradients flat slices hide. Radiologists read structure in three dimensions instead of stitching it together mentally.",
    label: "Asset 05 - Radiology visual",
    note: "1200 x 900 - enhanced scan or depth visualization",
  },
];

const DOCTORS = [
  { name: "Dr. Elena Marchetti", role: "Neurosurgeon", org: "Milan", quote: "The isosurface comes back before I finish my coffee. For skull-base work, having the geometry this fast changes how I plan the approach entirely." },
  { name: "Dr. Rajan Iyer", role: "Orthopedic Surgeon", org: "Bengaluru", quote: "Acetabular fracture mapping used to take my registrar an afternoon. The forged mesh gives me fragment relationships in minutes, and the watertight output prints without repair." },
  { name: "Dr. Sofia Lindqvist", role: "Biomedical Engineer", org: "Stockholm", quote: "I have benchmarked plenty of reconstruction pipelines. A deterministic marching cubes core with proper contrast enhancement beats heavier ML stacks on fidelity per megabyte." },
  { name: "Dr. Marcus Webb", role: "Maxillofacial Surgeon", org: "London", quote: "Mandible reconstruction planning needs exact cortical boundaries. The gamma-corrected extraction keeps thin bone walls intact where other tools dissolve them." },
  { name: "Dr. Amara Okafor", role: "Radiologist", org: "Lagos", quote: "Depth perception is the silent gap in slice reading. Spinning the forged volume has caught relationships I would have had to infer across thirty axial frames." },
  { name: "Dr. Kenji Watanabe", role: "Cardiothoracic Surgeon", org: "Osaka", quote: "Rib cage and sternum geometry in true scale, in the browser, with no software install on hospital machines. The zero-footprint design is what won our IT department over." },
  { name: "Dr. Isabelle Fournier", role: "Pediatric Surgeon", org: "Lyon", quote: "With children every millimeter matters. The mesh accuracy on small anatomy has been consistently within what I need for confident pre-operative decisions." },
  { name: "Dr. Tomas Herrera", role: "Trauma Surgeon", org: "Buenos Aires", quote: "In trauma the clock is the enemy. Upload the series, get structure back fast, and brief the team around an actual 3D model instead of a stack of films." },
  { name: "Dr. Priya Deshmukh", role: "Oncological Surgeon", org: "Mumbai", quote: "Tumor margin visualization against bony landmarks is where this shines. The enhanced contrast pulls boundaries that standard windowing leaves ambiguous." },
  { name: "Dr. Lars Eriksen", role: "Research Fellow, 3D Printing Lab", org: "Copenhagen", quote: "Every STL we have forged sliced cleanly on the first pass. For a lab printing dozens of anatomical models weekly, zero mesh-repair time is a real budget line." },
];

function Avatar({ src, name }: { src?: string; name: string }) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="h-12 w-12 rounded-full object-cover" />;
  }
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-full text-[11px] font-semibold tracking-widest text-ink"
      style={{ background: "linear-gradient(135deg, var(--color-peach), var(--color-mint))" }}
      aria-label={`${name} portrait pending`}
    >
      {initials}
    </div>
  );
}

export default function InsightsPage() {
  const { navigate } = usePageTransition();
  const [tab, setTab] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = wrapRef.current
      ? (Array.from(wrapRef.current.children) as HTMLElement[])
      : [];
    const N = cards.length;

    const layout = (p: number) => {
      cards.forEach((el, i) => {
        const theta = (i / N) * Math.PI * 2 + p * Math.PI * 3;
        const depth = (Math.cos(theta) + 1) / 2;
        const x = Math.sin(theta) * 34;
        const y = (depth - 0.5) * -5;
        const s = 0.5 + depth * 0.55;
        const o = 0.06 + Math.pow(depth, 2.4) * 0.94;
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}vw, ${y.toFixed(2)}vh, 0) scale(${s.toFixed(3)}) rotateY(${(-Math.sin(theta) * 16).toFixed(2)}deg)`;
        el.style.opacity = o.toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    };

    const st = ScrollTrigger.create({
      trigger: stageRef.current,
      start: "top top",
      end: "+=3600",
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => layout(self.progress),
      onRefresh: (self) => layout(self.progress),
    });
    layout(0);

    return () => {
      st.kill();
    };
  }, []);

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-ink px-[clamp(20px,5vw,64px)] pb-[14vh] text-peach">
      <section className="flex min-h-[68vh] flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mb-6 text-[10px] uppercase tracking-[0.5em] text-mint"
        >
          03 - Insights
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: "var(--font-space)" }}
          className="text-[clamp(34px,6vw,84px)] font-light uppercase tracking-[0.25em]"
        >
          <ScrambleText text="Insights" autoStart delay={1.1} />
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="mt-8 max-w-md text-[11px] uppercase leading-loose tracking-[0.3em] text-peach/45"
        >
          Where the forge runs, and what the people running it say.
        </motion.p>
      </section>

      <section className="mx-auto max-w-5xl">
        <div className="flex flex-wrap gap-2 border-t border-peach/15 pt-8">
          {CASES.map((c, i) => (
            <button
              key={c.t}
              onClick={() => setTab(i)}
              className={`border px-5 py-3 text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
                tab === i
                  ? "border-mint bg-mint text-ink"
                  : "border-peach/20 text-peach/60 hover:border-peach/50 hover:text-peach"
              }`}
            >
              {c.t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2"
          >
            <div>
              <h2 style={{ fontFamily: "var(--font-clash)" }} className="text-[clamp(26px,3.4vw,44px)] font-semibold uppercase tracking-tight">
                {CASES[tab].t}
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed tracking-wide text-peach/60">
                {CASES[tab].d}
              </p>
            </div>
            <MediaFrame alt={CASES[tab].t} label={CASES[tab].label} note={CASES[tab].note} ratio="4 / 3" />
          </motion.div>
        </AnimatePresence>
      </section>

      <section ref={stageRef} className="relative mt-[16vh] h-dvh">
        <p className="absolute left-1/2 top-10 -translate-x-1/2 text-[10px] uppercase tracking-[0.5em] text-mint">
          Practitioner voices - scroll
        </p>
        <div ref={wrapRef} className="absolute inset-0" style={{ perspective: "1300px" }}>
          {DOCTORS.map((d) => (
            <article
              key={d.name}
              className="absolute left-1/2 top-1/2 w-[clamp(270px,32vw,400px)] border border-peach/15 bg-surface/80 p-7 backdrop-blur-sm"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="text-sm leading-relaxed tracking-wide text-peach/80">{d.quote}</p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar name={d.name} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-peach">{d.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-mint">
                    {d.role} - {d.org}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-[10vh] flex max-w-5xl justify-end">
        <button onClick={() => navigate("/faq")} className="group flex items-baseline gap-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-mint">Next</span>
          <span
            style={{ fontFamily: "var(--font-clash)" }}
            className="text-[clamp(22px,3vw,38px)] font-semibold uppercase tracking-tight text-peach transition-transform duration-300 group-hover:translate-x-2"
          >
            FAQ
          </span>
        </button>
      </div>
    </main>
  );
}
