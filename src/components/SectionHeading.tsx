"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden="true">
      <motion.span
        className="h-px w-16 origin-right bg-gradient-to-l from-gold/70 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
      />
      <svg
        viewBox="0 0 24 12"
        className="h-3 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      >
        <path d="M12 2.6l2.5 3.4-2.5 3.4-2.5-3.4z" />
        <path d="M7.4 6C5.4 3.8 3 3.8 1 6c2 2.2 4.4 2.2 6.4 0z" />
        <path d="M16.6 6c2-2.2 4.4-2.2 6.4 0-2 2.2-4.4 2.2-6.4 0z" />
      </svg>
      <motion.span
        className="h-px w-16 origin-left bg-gradient-to-r from-gold/70 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
      />
    </div>
  );
}

export default function SectionHeading({ script, title }: { script: string; title: string }) {
  return (
    <Reveal className="mx-auto mb-[clamp(40px,6vw,72px)] max-w-[600px] text-center">
      <p className="font-script text-[clamp(1.9rem,4.4vw,2.4rem)] leading-none text-gold">{script}</p>
      <h2 className="mt-3 pl-[0.18em] font-serif text-[clamp(1.4rem,3.6vw,2rem)] font-light uppercase tracking-[0.18em]">
        {title}
      </h2>
      <Ornament className="mt-5" />
    </Reveal>
  );
}
