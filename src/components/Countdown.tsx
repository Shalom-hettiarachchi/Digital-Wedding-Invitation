"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FloralSpray } from "./Florals";
import PauseOffscreen from "./PauseOffscreen";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const WEDDING_DATE = new Date("2027-06-18T15:30:00");
const RING_LENGTH = 289.03; // circumference of the r=46 progress ring

function getRemaining() {
  const diff = Math.max(0, WEDDING_DATE.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden align-top">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "60%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Ring({ value, max, label }: { value: number; max: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  const progress = Math.min(1, value / max);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative grid aspect-square w-[clamp(62px,17.5vw,132px)] place-items-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-line)" strokeWidth="0.8" />
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            initial={{ strokeDashoffset: RING_LENGTH }}
            animate={{ strokeDashoffset: RING_LENGTH * (1 - progress) }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </svg>
        <div className="flex flex-nowrap font-serif text-[clamp(1.45rem,5vw,3rem)] font-light leading-none lining-nums tabular-nums">
          {padded.split("").map((d, i) => (
            <Digit key={i} value={d} />
          ))}
        </div>
      </div>
      <div className="pl-[0.24em] text-[0.58rem] uppercase tracking-[0.24em] text-muted sm:text-[0.66rem]">
        {label}
      </div>
    </div>
  );
}

export default function Countdown() {
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    // Client-only clock value: setting it immediately on mount (rather than
    // waiting for the first interval tick) avoids a one-second flash of 00:00:00:00.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(getRemaining());
    const id = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const { days = 0, hours = 0, minutes = 0, seconds = 0 } = remaining ?? {};

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-paper)_0%,#f5f0e7_16%,#f5f0e7_84%,var(--color-paper)_100%)] px-4 py-[clamp(84px,12vh,150px)] sm:px-8">
      <Reveal className="relative mx-auto max-w-[880px]">
        <div className="relative border border-gold/40 bg-[#fffefb] px-4 pb-12 pt-[72px] text-center shadow-[0_40px_70px_-40px_rgba(74,59,37,0.38)] sm:px-12 sm:pb-16 sm:pt-20">
          <div className="pointer-events-none absolute inset-1.5 border border-gold/15" />

          <SectionHeading script="Counting down" title="Until we say I do" />

          <div
            role="timer"
            aria-label={`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds until the wedding`}
            className="flex items-start justify-center gap-[clamp(8px,2.6vw,30px)]"
          >
            <Ring value={days} max={365} label="Days" />
            <Ring value={hours} max={24} label="Hours" />
            <Ring value={minutes} max={60} label="Minutes" />
            <Ring value={seconds} max={60} label="Seconds" />
          </div>

          <p className="mt-10 font-serif text-[1.1rem] italic text-ink/65 lining-nums">
            Saturday, 18 June 2027 &middot; half past three
          </p>
        </div>

        <PauseOffscreen className="pointer-events-none absolute -left-3 -top-10 w-[clamp(132px,27vw,260px)] sm:-left-8 sm:-top-12">
          <FloralSpray />
        </PauseOffscreen>
        <PauseOffscreen className="pointer-events-none absolute -bottom-10 -right-3 w-[clamp(132px,27vw,260px)] rotate-180 sm:-bottom-12 sm:-right-8">
          <FloralSpray />
        </PauseOffscreen>
      </Reveal>
    </section>
  );
}
