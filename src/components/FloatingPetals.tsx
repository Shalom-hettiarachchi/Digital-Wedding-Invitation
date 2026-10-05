"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TONES = [
  { fill: "#f3cdc1", stroke: "#d99f90" },
  { fill: "#fffaf3", stroke: "#d3c4ab" },
  { fill: "#ebb9ab", stroke: "#cf8f80" },
  { fill: "#f8e4dc", stroke: "#e0b3a5" },
];

type PetalConfig = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  flips: number;
  tone: number;
};

// Seeded so the server-rendered markup and the client's first render agree.
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n: number) => Math.round(n * 100) / 100;

function makePetals(count: number, seed: number): PetalConfig[] {
  const rand = seeded(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: round(4 + rand() * 92),
    size: round(11 + rand() * 11),
    duration: round(15 + rand() * 11),
    delay: round(rand() * 13),
    drift: round(30 + rand() * 60),
    spin: round(rand() * 360),
    flips: rand() > 0.5 ? 2 : 1,
    tone: Math.floor(rand() * TONES.length),
  }));
}

export default function FloatingPetals({
  count = 12,
  active = true,
  seed = 7,
}: {
  count?: number;
  active?: boolean;
  seed?: number;
}) {
  const reduce = useReducedMotion();
  const petals = useMemo(() => makePetals(count, seed), [count, seed]);

  if (!active || reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((p) => {
        const loop = { duration: p.duration, delay: p.delay, repeat: Infinity };
        const tone = TONES[p.tone];
        return (
          <motion.div
            key={p.id}
            className="absolute -top-8"
            style={{ left: `${p.left}%` }}
            initial={{ y: "0vh", opacity: 0 }}
            animate={{
              y: ["0vh", "112vh"],
              x: [0, p.drift, -p.drift * 0.5, p.drift * 0.4, 0],
              rotate: [p.spin, p.spin + 260],
              rotateX: [0, 360 * p.flips],
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              y: { ...loop, ease: "linear" },
              x: { ...loop, ease: "easeInOut" },
              rotate: { ...loop, ease: "linear" },
              rotateX: { ...loop, ease: "linear" },
              opacity: { ...loop, ease: "linear", times: [0, 0.08, 0.86, 1] },
            }}
          >
            <svg viewBox="-11 -23 22 24" width={p.size} height={p.size}>
              <path
                d="M0 0C-9 -5 -10 -18 0 -22C10 -18 9 -5 0 0Z"
                fill={tone.fill}
                stroke={tone.stroke}
                strokeWidth="0.7"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
