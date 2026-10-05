"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import SectionHeading from "./SectionHeading";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Item = { time: string; label: string; desc: string; icon: ReactNode };

const items: Item[] = [
  {
    time: "3:30 PM",
    label: "Ceremony",
    desc: "Vows beneath the garden arch.",
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="14" r="5.5" />
        <circle cx="15" cy="14" r="5.5" />
      </svg>
    ),
  },
  {
    time: "4:30 PM",
    label: "Cocktail Hour",
    desc: "Drinks and canapés on the terrace.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 4L19 4L12 13Z" />
        <path d="M12 13V20M8.5 20H15.5" />
      </svg>
    ),
  },
  {
    time: "5:00 PM",
    label: "Photo Session",
    desc: "Golden-hour portraits with family and friends.",
    icon: (
      <svg {...iconProps}>
        <path d="M9 7l1.5-2h3L15 7" />
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <circle cx="12" cy="13" r="3.2" />
      </svg>
    ),
  },
  {
    time: "6:30 PM",
    label: "Dinner Reception",
    desc: "A seated dinner in the Great Hall.",
    icon: (
      <svg {...iconProps}>
        <path d="M7.5 3v6M10 3v6M12.5 3v6M10 9v12" />
        <path d="M16 3V9Q16 12 18.5 12V21" />
      </svg>
    ),
  },
  {
    time: "8:00 PM",
    label: "Dance Party",
    desc: "Music, dancing and a midnight toast.",
    icon: (
      <svg {...iconProps}>
        <path d="M9 18V6l10-2v12" />
        <circle cx="7" cy="18" r="2.4" />
        <circle cx="17" cy="16" r="2.4" />
      </svg>
    ),
  },
];

function TimelineItem({ item, index }: { item: Item; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  // Lights up roughly as the gold rail reaches it, and stays lit.
  const lit = useInView(ref, { once: true, margin: "0px 0px -38% 0px" });
  const left = index % 2 === 0;

  return (
    <li ref={ref} className="relative pl-[62px] md:grid md:grid-cols-2 md:gap-x-24 md:pl-0">
      <div
        className={`absolute left-0 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border transition-all duration-700 md:left-1/2 md:-translate-x-1/2 ${
          lit
            ? "border-gold bg-gold text-paper shadow-[0_0_0_6px_rgba(169,143,92,0.14)]"
            : "border-line bg-paper text-muted"
        }`}
      >
        <span className="h-[18px] w-[18px]">{item.icon}</span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: left ? -36 : 36, y: 12 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`relative border border-line bg-[#fffefb] px-6 py-5 shadow-[0_20px_40px_-30px_rgba(74,59,37,0.4)] transition-[border-color,box-shadow,translate] duration-500 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_26px_44px_-28px_rgba(74,59,37,0.5)] ${
          left ? "md:col-start-1 md:text-right" : "md:col-start-2"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-[35px] hidden h-px w-12 bg-gold/40 md:block ${left ? "left-full" : "right-full"}`}
        />
        <p className="font-serif text-[1.75rem] leading-none text-gold lining-nums">{item.time}</p>
        <h3 className="mt-2.5 text-[0.8rem] uppercase tracking-[0.2em]">{item.label}</h3>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-[#5a5a55]">{item.desc}</p>
      </motion.div>
    </li>
  );
}

export default function Timeline() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 0.7", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });

  return (
    <section className="px-5 py-[clamp(60px,10vh,120px)] sm:px-6">
      <SectionHeading script="The celebration" title="Order of the day" />

      <div ref={railRef} className="relative mx-auto max-w-[920px]">
        <div
          aria-hidden="true"
          className="absolute bottom-4 left-[19.5px] top-4 w-px bg-line md:left-1/2 md:-translate-x-1/2"
        />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: fill }}
          className="absolute bottom-4 left-[19.5px] top-4 w-px origin-top bg-gold md:left-1/2 md:-translate-x-1/2"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[13px] left-[16.5px] h-[7px] w-[7px] rotate-45 border border-gold bg-paper md:left-1/2 md:-translate-x-1/2"
        />
        <ol className="space-y-6 md:space-y-3">
          {items.map((item, i) => (
            <TimelineItem key={item.label} item={item} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
