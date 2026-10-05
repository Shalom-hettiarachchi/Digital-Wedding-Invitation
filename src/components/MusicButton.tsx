"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function MusicButton({
  visible,
  playing,
  onToggle,
}: {
  visible: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={playing ? "Turn music off" : "Turn music on"}
          aria-pressed={playing}
          title={playing ? "Music on" : "Music off"}
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay: 2.4 } }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.3 } }}
          whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.94, transition: { duration: 0.1 } }}
          className="fixed bottom-5 right-5 z-50 grid h-12 w-12 cursor-pointer place-items-center rounded-full border border-gold/50 bg-paper/90 text-gold shadow-[0_12px_30px_-12px_rgba(74,59,37,0.5)] backdrop-blur-sm"
        >
          {playing && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-gold/60"
              animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="relative flex h-4 items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`eq-bar ${playing ? "eq-on" : ""}`} style={{ "--i": i } as CSSProperties} />
            ))}
            {!playing && <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
