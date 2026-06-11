"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import * as THREE from "three";
import { motion } from "motion/react";
import RequireAuth from "@/components/ui/RequireAuth";
import ScrambleText from "@/components/ui/ScrambleText";
import ProcessingOverlay from "@/components/dashboard/ProcessingOverlay";
import { api } from "@/lib/api";
import { parseStl, triangleCount } from "@/lib/stl";
import { useAuth } from "@/context/AuthContext";
import { usePageTransition } from "@/components/ui/PageTransition";

const HoloViewer = dynamic(() => import("@/components/dashboard/HoloViewer"), {
  ssr: false,
});

const DEMOS = [
  { id: "shell", name: "Calibration Shell", file: "/models/demo-shell.stl" },
  { id: "cranial-a", name: "Cranial Study A", file: "/models/demo-cranial-a.stl" },
  { id: "cranial-b", name: "Cranial Study B", file: "/models/demo-cranial-b.stl" },
  { id: "thoracic", name: "Thoracic Cage", file: "/models/demo-thoracic.stl" },
  { id: "pelvic", name: "Pelvic Frame", file: "/models/demo-pelvic.stl" },
  { id: "femur", name: "Femur Segment", file: "/models/demo-femur.stl" },
  { id: "vertebral", name: "Vertebral Stack", file: "/models/demo-vertebral.stl" },
  { id: "mandible", name: "Mandible Arc", file: "/models/demo-mandible.stl" },
  { id: "scapula", name: "Scapula Wing", file: "/models/demo-scapula.stl" },
];

type Meta = {
  name: string;
  tris: number;
  sizeMB: string;
  source: string;
  forgedAt: string;
};

function Panel({
  children,
  className,
  delay = 0,
  dur = 7,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dur?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -8, 0, 6, 0] }}
        transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
        className="border border-peach/15 bg-surface/55 p-5 backdrop-blur-md"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function ForgeFloor() {
  const { user, logout } = useAuth();
  const { navigate } = usePageTransition();
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [phase, setPhase] = useState<"upload" | "forge" | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [paused, setPaused] = useState(false);
  const [clock, setClock] = useState("");
  const [forgeCount, setForgeCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForgeCount(Number(localStorage.getItem("df_forge_count") || 0));
    const tick = () =>
      setClock(
        new Date().toLocaleString(undefined, {
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const stamp = () =>
    new Date().toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const loadDemo = async (demo: (typeof DEMOS)[number]) => {
    if (phase) return;
    setError(null);
    try {
      const res = await fetch(demo.file);
      if (!res.ok) throw new Error();
      const buf = await res.arrayBuffer();
      const geo = parseStl(buf);
      setGeometry(geo);
      setBlob(null);
      setMeta({
        name: demo.name,
        tris: triangleCount(geo),
        sizeMB: (buf.byteLength / 1024 / 1024).toFixed(2),
        source: "Archive demo",
        forgedAt: stamp(),
      });
    } catch {
      setError("That demo model is not installed yet");
    }
  };

  const onFiles = async (list: FileList | null) => {
    if (!list || phase) return;
    const files = Array.from(list);
    setError(null);

    if (!files.every((f) => f.name.toLowerCase().endsWith(".dcm"))) {
      setError("Only DICOM files with the .dcm extension are accepted");
      return;
    }
    if (files.length < 8 || files.length > 40) {
      setError("Upload between 8 and 40 slices from one series");
      return;
    }

    const fd = new FormData();
    files.forEach((f) => fd.append("slices", f));
    setPhase("upload");
    setUploadPct(0);

    try {
      const res = await api.post("/api/forge", fd, {
        responseType: "arraybuffer",
        onUploadProgress: (e) => {
          const pct = e.total ? Math.round((e.loaded / e.total) * 100) : 50;
          setUploadPct(pct);
          if (pct >= 100) setPhase("forge");
        },
      });
      setPhase("forge");
      const geo = parseStl(res.data);
      await new Promise((r) => setTimeout(r, 900));
      setGeometry(geo);
      setBlob(new Blob([res.data], { type: "model/stl" }));
      setMeta({
        name: "Forged series",
        tris: Number(res.headers["x-triangle-count"]) || triangleCount(geo),
        sizeMB: (res.data.byteLength / 1024 / 1024).toFixed(2),
        source: `${files.length} slices forged`,
        forgedAt: stamp(),
      });
      const next = forgeCount + 1;
      setForgeCount(next);
      localStorage.setItem("df_forge_count", String(next));
      localStorage.setItem("df_last_forge", stamp());
    } catch (err) {
      let msg = "The forge failed on this series";
      if (axios.isAxiosError(err) && err.response?.data) {
        try {
          msg = JSON.parse(new TextDecoder().decode(err.response.data)).error || msg;
        } catch {}
      } else if (axios.isAxiosError(err) && err.code === "ERR_NETWORK") {
        msg = "The forge is unreachable. Is the backend running?";
      }
      setError(msg);
    } finally {
      setPhase(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const download = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dicomforge.stl";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-ink text-peach">
      <HoloViewer geometry={geometry} paused={paused} />
      <ProcessingOverlay phase={phase} uploadPct={uploadPct} />

      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-7 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 text-center"
      >
        <p
          style={{ fontFamily: "var(--font-clash)" }}
          className="text-xl font-semibold uppercase tracking-tight"
        >
          <ScrambleText text={`Hey, ${user?.name ?? "Operator"}`} autoStart delay={1.0} framesPerChar={6} />
        </p>
        <p className="text-[9px] uppercase tracking-[0.35em] text-mint">{clock}</p>
        <p className="text-[9px] uppercase tracking-[0.3em] text-peach/40">
          Forges: {forgeCount}
          {typeof window !== "undefined" && localStorage.getItem("df_last_forge")
            ? ` - Last: ${localStorage.getItem("df_last_forge")}`
            : ""}
        </p>
      </motion.div>

      {!geometry && !phase && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p
            style={{ fontFamily: "var(--font-space)" }}
            className="text-[11px] uppercase tracking-[0.5em] text-peach/40"
          >
            <ScrambleText text="Select a demo or upload a series" autoStart delay={1.2} framesPerChar={7} />
          </p>
        </div>
      )}

      <Panel className="absolute left-[clamp(16px,4vw,56px)] top-28 z-30 w-64" delay={0.9}>
        <p className="text-[9px] uppercase tracking-[0.4em] text-mint">Specimen</p>
        {meta ? (
          <div className="mt-3 flex flex-col gap-2">
            <p style={{ fontFamily: "var(--font-clash)" }} className="text-lg font-semibold uppercase tracking-tight">
              {meta.name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-peach/60">
              {meta.tris.toLocaleString()} triangles
            </p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-peach/60">{meta.sizeMB} MB binary STL</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-mint/70">{meta.source}</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-peach/45">{meta.forgedAt}</p>
            <button
              onClick={() => setPaused((p) => !p)}
              className="mt-2 border border-peach/25 py-2 text-[9px] uppercase tracking-[0.35em] transition-colors duration-300 hover:border-mint hover:text-mint"
            >
              {paused ? "Resume rotation" : "Pause rotation"}
            </button>
            {blob && (
              <button
                onClick={download}
                className="border border-peach/25 py-2 text-[9px] uppercase tracking-[0.35em] transition-colors duration-300 hover:border-mint hover:text-mint"
              >
                Download STL
              </button>
            )}
          </div>
        ) : (
          <p className="mt-3 text-[10px] uppercase leading-loose tracking-[0.25em] text-peach/40">
            No model on the floor
          </p>
        )}
      </Panel>

      <Panel className="absolute right-[clamp(16px,4vw,56px)] top-28 z-30 w-64" delay={1.1} dur={8}>
        <p className="text-[9px] uppercase tracking-[0.4em] text-mint">Forge intake</p>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={!!phase}
          className="mt-3 w-full border border-dashed border-peach/30 py-6 text-[10px] uppercase tracking-[0.3em] text-peach/70 transition-colors duration-300 hover:border-mint hover:text-mint disabled:opacity-50"
        >
          Upload DICOM series
          <span className="mt-1 block text-[8px] tracking-[0.25em] text-peach/35">8 to 40 .dcm slices</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".dcm"
          multiple
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />

        <p className="mt-5 text-[9px] uppercase tracking-[0.4em] text-mint">Archive</p>
        <div data-lenis-prevent className="mt-2 flex max-h-[34vh] flex-col gap-1.5 overflow-y-auto pr-1">
          {DEMOS.map((d, i) => (
            <button
              key={d.id}
              onClick={() => loadDemo(d)}
              disabled={!!phase}
              className="group/item flex items-center justify-between border border-peach/15 border-l-2 border-l-transparent px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.25em] text-peach/70 transition-all duration-300 hover:border-l-mint hover:bg-mint/[0.06] hover:text-peach disabled:opacity-50"
            >
              <span className="flex items-baseline gap-2.5">
                <span className="text-[8px] tracking-[0.3em] text-mint/60 transition-colors duration-300 group-hover/item:text-mint">{String(i + 1).padStart(2, "0")}</span>
                <span className="transition-transform duration-300 group-hover/item:translate-x-1">{d.name}</span>
              </span>
              <span className="-translate-x-1 text-mint opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100">&gt;</span>
            </button>
          ))}
        </div>
      </Panel>

      <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
        {error && (
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#E8917C]">
            <ScrambleText key={error} text={error} autoStart framesPerChar={4} />
          </p>
        )}
        <p className="text-[9px] uppercase tracking-[0.4em] text-peach/30">Forge floor</p>
      </div>

      <button
        onClick={() => {
          logout();
          navigate("/access");
        }}
        className="absolute bottom-7 right-[clamp(16px,4vw,56px)] z-30 text-[9px] uppercase tracking-[0.4em] text-peach/40 transition-colors duration-300 hover:text-mint"
      >
        Log out
      </button>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <ForgeFloor />
    </RequireAuth>
  );
}
