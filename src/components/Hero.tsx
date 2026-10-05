"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import FloatingPetals from "./FloatingPetals";
import { FloralCorner } from "./Florals";
import PauseOffscreen from "./PauseOffscreen";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Timed to begin as the envelope overlay starts to dissolve.
const content: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.17, delayChildren: 1.3 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.1, ease: EASE } },
};

const nameBlock: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.32 } },
};

const nameRow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075 } },
};

const letter: Variants = {
  hidden: { opacity: 0, y: "0.4em", filter: "blur(10px)" },
  show: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 1.15, ease: EASE } },
};

const bloom: Variants = {
  hidden: { opacity: 0, scale: 0.7, rotate: -12 },
  show: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 2.4, ease: EASE, delay: 1 + i * 0.3 },
  }),
};

const frame: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.8, ease: EASE, delay: 0.9 } },
};

const SPARKLES = [
  { top: "24%", left: "30%", size: 3, delay: 0 },
  { top: "18%", left: "62%", size: 2, delay: 1.3 },
  { top: "36%", left: "76%", size: 3, delay: 2.1 },
  { top: "58%", left: "20%", size: 2, delay: 0.7 },
  { top: "70%", left: "34%", size: 3, delay: 2.8 },
  { top: "76%", left: "66%", size: 2, delay: 1.8 },
  { top: "46%", left: "12%", size: 2, delay: 3.4 },
  { top: "50%", left: "88%", size: 3, delay: 0.4 },
];

function Letters({ text }: { text: string }) {
  return (
    <motion.span variants={nameRow} className="block pl-[0.14em]" aria-hidden="true">
      {text.split("").map((ch, i) => (
        <motion.span key={i} variants={letter} className="inline-block">
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero({ active = true }: { active?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const state = active ? "show" : "hidden";

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 16, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 40, damping: 16, mass: 0.6 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const tlX = useTransform(sx, (v) => v * -26);
  const tlY = useTransform([sy, scrollYProgress], ([p, s]: number[]) => p * -26 - s * 90);
  const brX = useTransform(sx, (v) => v * -36);
  const brY = useTransform([sy, scrollYProgress], ([p, s]: number[]) => p * -36 + s * 50);
  const textX = useTransform(sx, (v) => v * 9);
  const textY = useTransform([sy, scrollYProgress], ([p, s]: number[]) => p * 9 + s * 120);
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-28 text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_0%_0%,rgba(241,210,199,0.42),transparent_72%),radial-gradient(55%_45%_at_100%_100%,rgba(195,204,182,0.4),transparent_72%)]" />

      <motion.div
        variants={frame}
        initial="hidden"
        animate={state}
        className="pointer-events-none absolute inset-3.5 border border-gold/35 md:inset-6"
      >
        <div className="absolute inset-1.5 border border-gold/15" />
      </motion.div>

      <motion.div
        style={{ x: tlX, y: tlY }}
        className="pointer-events-none absolute left-0 top-0 w-[66vw] max-w-[480px] md:w-[40vw]"
      >
        <motion.div variants={bloom} custom={0} initial="hidden" animate={state} style={{ originX: 0, originY: 0 }}>
          <PauseOffscreen>
            <FloralCorner />
          </PauseOffscreen>
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: brX, y: brY }}
        className="pointer-events-none absolute bottom-0 right-0 w-[66vw] max-w-[480px] md:w-[40vw]"
      >
        <div className="rotate-180">
          <motion.div variants={bloom} custom={1} initial="hidden" animate={state} style={{ originX: 0, originY: 0 }}>
            <PauseOffscreen>
              <FloralCorner />
            </PauseOffscreen>
          </motion.div>
        </div>
      </motion.div>

      <FloatingPetals count={14} active={active} seed={21} />

      {active &&
        !reduce &&
        SPARKLES.map((s, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-gold"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.5, 0.3] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: 2.5 + s.delay, ease: "easeInOut" }}
          />
        ))}

      <motion.div style={{ x: textX, y: textY, opacity: textOpacity }} className="relative z-10">
        <motion.div variants={content} initial="hidden" animate={state} className="flex flex-col items-center">
          <motion.p
            variants={rise}
            className="font-script text-[clamp(1.9rem,4.6vw,2.6rem)] leading-none text-gold"
          >
            The wedding of
          </motion.p>

          <motion.h1
            variants={nameBlock}
            aria-label="Emma and James"
            className="mt-6 font-serif text-[clamp(3rem,11vw,5.75rem)] font-light uppercase leading-[1.02] tracking-[0.14em]"
          >
            <Letters text="Emma" />
            <motion.span
              variants={rise}
              aria-hidden="true"
              className="my-1.5 flex items-center justify-center gap-5 text-[0.48em] leading-none tracking-normal"
            >
              <span className="h-px w-[clamp(36px,9vw,84px)] bg-gradient-to-r from-transparent to-gold/70" />
              <span className="shimmer-text font-serif italic normal-case">&amp;</span>
              <span className="h-px w-[clamp(36px,9vw,84px)] bg-gradient-to-l from-transparent to-gold/70" />
            </motion.span>
            <Letters text="James" />
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-9 pl-[0.34em] text-[0.68rem] uppercase tracking-[0.34em] text-muted"
          >
            Request the pleasure <br className="sm:hidden" />
            of your company
          </motion.p>

          <motion.div
            variants={rise}
            className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-7"
          >
            <span className="justify-self-end border-y border-gold/50 py-2 pl-[0.3em] text-[0.7rem] uppercase tracking-[0.3em]">
              Saturday
            </span>
            <span className="flex flex-col items-center leading-none">
              <span className="pl-[0.34em] text-[0.66rem] uppercase tracking-[0.34em] text-muted">June</span>
              <span className="my-1.5 font-serif text-[clamp(2.8rem,8vw,3.8rem)] font-light lining-nums">18</span>
              <span className="pl-[0.34em] text-[0.66rem] tracking-[0.34em] text-muted">2027</span>
            </span>
            <span className="justify-self-start border-y border-gold/50 py-2 pl-[0.3em] text-[0.7rem] uppercase tracking-[0.3em]">
              3:30 PM
            </span>
          </motion.div>

          <motion.p variants={rise} className="mt-6 font-serif text-[1.15rem] italic text-ink/70">
            Obira Castle
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 1.2, delay: active ? 3.4 : 0 }}
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 pl-[0.3em] text-[0.62rem] uppercase tracking-[0.3em] text-muted max-sm:left-[21%]"
      >
        Scroll
        <motion.div
          className="mx-auto mt-2 h-8 w-px origin-top bg-gold/60"
          animate={reduce ? undefined : { scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.6, 1] }}
        />
      </motion.div>
    </section>
  );
}
