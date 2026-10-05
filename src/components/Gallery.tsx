"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const photos = [
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop",
];

export default function Gallery() {
  return (
    <section className="py-[clamp(60px,10vh,120px)] px-6">
      <SectionHeading script="Us, lately" title="A few moments" />

      <div className="max-w-[1000px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-3.5">
        {photos.map((src, i) => {
          const offset = i === 1 || i === 4;
          return (
            <Reveal
              key={src}
              delay={i * 0.07}
              className={`relative overflow-hidden bg-[#e8e6df] cursor-pointer aspect-[3/4] ${
                offset ? "md:self-start md:aspect-[3/4.6]" : ""
              }`}
            >
              <motion.div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
                initial={{ scale: 1.04 }}
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
