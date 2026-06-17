"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";
import DecryptField from "@/components/ui/DecryptField";
import { useAuth } from "@/context/AuthContext";
import { usePageTransition } from "@/components/ui/PageTransition";

type Mode = "signin" | "signup";
type Phase = "idle" | "loading" | "success";

export default function AccessPage() {
  const { login, register } = useAuth();
  const { navigate } = usePageTransition();
  const [mode, setMode] = useState<Mode>("signin");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const switchMode = (m: Mode) => {
    if (m === mode || phase !== "idle") return;
    setMode(m);
    setError(null);
  };

  const submit = async () => {
    if (phase !== "idle") return;
    setError(null);
    setPhase("loading");
    try {
      if (mode === "signin") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      setPhase("success");
      setTimeout(() => navigate("/dashboard"), 1100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPhase("idle");
      setShake((s) => s + 1);
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col items-stretch overflow-hidden bg-ink text-peach md:flex-row">
      <div className="hidden flex-1 flex-col items-center justify-center gap-10 md:flex">
        <motion.svg
          width="min(26vw, 300px)"
          viewBox="0 0 380 260"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <defs>
            <filter id="accessGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g transform="translate(24 0) skewX(-12)" filter="url(#accessGlow)">
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="max-w-xs text-center text-[10px] uppercase leading-loose tracking-[0.4em] text-peach/40"
        >
          Authorised personnel reach the forge floor
        </motion.p>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-20 md:py-24">
        <motion.div
          key={shake}
          animate={{ x: shake ? [0, -11, 11, -7, 7, -3, 0] : 0 }}
          transition={{ duration: 0.45 }}
          className="relative w-full max-w-md border border-peach/15 bg-surface/70 p-10 backdrop-blur-md"
        >
          <motion.button
            onClick={() => navigate("/")}
            aria-label="Close and return home"
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center"
          >
            <span className="absolute block h-[1.5px] w-5 rotate-45 bg-peach" />
            <span className="absolute block h-[1.5px] w-5 -rotate-45 bg-peach" />
          </motion.button>

          <AnimatePresence mode="wait">
            {phase === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-[380px] flex-col items-center justify-center gap-7 text-center"
              >
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <motion.path
                    d="M14 33 L27 46 L50 20"
                    fill="none"
                    stroke="var(--color-mint)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                  />
                </svg>
                <p
                  style={{ fontFamily: "var(--font-space)" }}
                  className="text-sm uppercase tracking-[0.4em] text-mint"
                >
                  <ScrambleText text="Access granted" autoStart framesPerChar={5} />
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-9 flex gap-8">
                  {(["signin", "signup"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => switchMode(m)}
                      style={{ fontFamily: "var(--font-clash)" }}
                      className={`text-[clamp(20px,2.4vw,28px)] font-semibold uppercase tracking-tight transition-colors duration-300 ${
                        mode === m ? "text-peach" : "text-peach/25 hover:text-peach/55"
                      }`}
                    >
                      {m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-5">
                  {mode === "signup" && (
                    <DecryptField label="Name" value={name} onChange={setName} delay={0.15} autoComplete="name" />
                  )}
                  <DecryptField label="Email" value={email} onChange={setEmail} delay={0.3} autoComplete="email" />
                  <DecryptField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    delay={0.45}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                </div>

                <div className="mt-3 min-h-[34px] pt-3">
                  {error && (
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#E8917C]">
                      <ScrambleText text={error} autoStart framesPerChar={4} />
                    </p>
                  )}
                </div>

                <button
                  onClick={submit}
                  disabled={phase === "loading"}
                  className="group relative mt-2 w-full overflow-hidden border border-peach/25 py-4 text-[11px] uppercase tracking-[0.45em] text-peach transition-colors duration-300 hover:border-mint disabled:opacity-80"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-mint/25 to-transparent ${
                      phase === "loading" ? "animate-[beam_1.1s_linear_infinite]" : "transition-transform duration-700 group-hover:translate-x-full"
                    }`}
                  />
                  <span className="relative">
                    {phase === "loading"
                      ? "Authorising"
                      : mode === "signin"
                      ? "Enter the forge"
                      : "Create access"}
                  </span>
                </button>

                <p className="mt-7 text-center text-[9px] uppercase tracking-[0.35em] text-peach/30">
                  {mode === "signin" ? "No access yet?" : "Already authorised?"}{" "}
                  <button
                    onClick={() => switchMode(mode === "signin" ? "signup" : "signin")}
                    className="text-mint/70 transition-colors duration-300 hover:text-mint"
                  >
                    {mode === "signin" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
