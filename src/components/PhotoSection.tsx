"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function PhotoSection({
  src,
  eyebrow,
  title,
  children,
  reverse = false,
}: {
  src: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <Reveal className="grid md:grid-cols-2">
      <div
        className={`relative overflow-hidden min-h-[280px] md:min-h-[420px] bg-[#e8e6df] ${
          reverse ? "md:order-2" : ""
        }`}
      >
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${src})` }}
          initial={{ scale: 1.05 }}
          whileHover={{ scale: 1.14 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className={`p-9 sm:p-14 md:p-[clamp(40px,6vw,90px)] flex flex-col justify-center ${reverse ? "md:order-1" : ""}`}>
        <p className="font-script text-[clamp(1.8rem,3.6vw,2.2rem)] leading-none text-gold">{eyebrow}</p>
        <h2 className="mt-3 font-serif text-[clamp(1.4rem,3vw,1.9rem)] font-light uppercase tracking-[0.16em]">
          {title}
        </h2>
        <div className="mb-6 mt-5 h-px w-14 bg-gradient-to-r from-gold/80 to-transparent" />
        {children}
      </div>
    </Reveal>
  );
}
