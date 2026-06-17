"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import ScrambleText from "@/components/ui/ScrambleText";
import { api } from "@/lib/api";

const GuideOrb = dynamic(() => import("@/components/guide/GuideOrb"), {
  ssr: false,
});

type Msg = { from: "user" | "guide"; text: string };

export default function ChatGuide() {
  const [open, setOpen] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "guide", text: "I am the Forge Guide. Ask me anything about DicomForge." },
  ]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setInput("");
    setMsgs((m) => [...m, { from: "user", text }]);
    setThinking(true);
    try {
      const { data } = await api.post("/api/chat", { message: text });
      setMsgs((m) => [...m, { from: "guide", text: data.reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { from: "guide", text: "The guide is unreachable right now. The forge may be waking up" },
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close forge guide" : "Open forge guide"}
        whileHover={{ scale: 1.08 }}
        className="fixed bottom-5 right-5 z-[9400] flex h-12 w-12 items-center justify-center rounded-full border border-mint/40 md:bottom-6 md:right-6"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(169,217,192,0.25), rgba(11,12,14,0.9))",
          boxShadow: "0 0 24px rgba(169,217,192,0.25)",
        }}
      >
        <motion.span
          animate={{ scale: thinking ? [1, 1.35, 1] : [1, 1.12, 1] }}
          transition={{ duration: thinking ? 0.7 : 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="h-2.5 w-2.5 rounded-full bg-mint"
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-4 left-4 z-[9400] flex flex-col border border-peach/15 bg-surface/90 backdrop-blur-xl sm:left-auto sm:right-6 sm:bottom-[5.5rem] sm:w-[min(92vw,340px)]"
          >
            <div className="flex items-center gap-3 border-b border-peach/10 px-4 py-3">
              <div className="h-12 w-12 shrink-0">
                <GuideOrb thinking={thinking} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-clash)" }} className="text-sm font-semibold uppercase tracking-tight text-peach">
                  Forge Guide
                </p>
                <p className="text-[8px] uppercase tracking-[0.35em] text-mint">
                  {thinking ? "Processing" : "Online"}
                </p>
              </div>
            </div>

            <div ref={listRef} className="flex max-h-[44vh] min-h-[180px] flex-col gap-3 overflow-y-auto px-4 py-4" data-lenis-prevent>
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-3.5 py-2.5 text-[11.5px] leading-relaxed tracking-wide ${
                    m.from === "user"
                      ? "self-end border border-mint/25 text-mint"
                      : "self-start border border-peach/15 text-peach/85"
                  }`}
                >
                  {m.from === "guide" && i === msgs.length - 1 ? (
                    <ScrambleText text={m.text} autoStart framesPerChar={2} glyphHold={3} />
                  ) : (
                    m.text
                  )}
                </div>
              ))}
              {thinking && (
                <p className="self-start px-1 text-[9px] uppercase tracking-[0.4em] text-mint/70">
                  <ScrambleText text="Thinking" autoStart framesPerChar={9} />
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-peach/10 px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask the guide"
                spellCheck={false}
                className="flex-1 bg-transparent text-base tracking-wide text-peach outline-none placeholder:text-peach/30 sm:text-[12px]"
                style={{ fontFamily: "var(--font-space)", caretColor: "var(--color-mint)" }}
              />
              <button
                onClick={send}
                disabled={thinking}
                className="text-[9px] uppercase tracking-[0.35em] text-mint/80 transition-colors duration-300 hover:text-mint disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
