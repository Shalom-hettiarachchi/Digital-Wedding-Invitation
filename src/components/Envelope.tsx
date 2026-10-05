"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import FloatingPetals from "./FloatingPetals";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Spark = { id: number; x: number; y: number; size: number; delay: number; color: string };

function makeSparks(): Spark[] {
  const colors = ["#a98f5c", "#cdb98c", "#f1d2c7", "#fffaf3"];
  return Array.from({ length: 20 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.6;
    const dist = 80 + Math.random() * 130;
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 20,
      size: 3 + Math.random() * 5,
      delay: 0.3 + Math.random() * 0.25,
      color: colors[i % colors.length],
    };
  });
}

const intro: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.16, delayChildren: 0.2 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

export default function Envelope({ onOpen }: { onOpen?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [sparks, setSparks] = useState<Spark[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    setSparks(makeSparks());
    onOpen?.();
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1250);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-paper px-5"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_42%,rgba(241,210,199,0.3),transparent_75%)]" />
          <FloatingPetals count={8} seed={3} />

          <motion.div
            variants={intro}
            initial="hidden"
            animate="show"
            exit={{ scale: 1.08, transition: { duration: 1, ease: "easeIn" } }}
            className="relative text-center"
          >
            <motion.p
              variants={rise}
              className="pl-[0.38em] text-[0.68rem] uppercase tracking-[0.38em] text-muted"
            >
              You have an invitation
            </motion.p>
            <motion.p variants={rise} className="mt-3 font-script text-[2.1rem] leading-none text-gold">
              from
            </motion.p>
            <motion.p
              variants={rise}
              className="mb-14 mt-4 pl-[0.16em] font-serif text-[clamp(2.1rem,7vw,3.2rem)] font-light uppercase leading-[1.12] tracking-[0.16em]"
            >
              <span className="block">Emma</span>
              <span className="block">
                <span className="font-serif italic normal-case tracking-normal text-gold">&amp;</span> James
              </span>
            </motion.p>

            <motion.div variants={rise} className="relative mx-auto w-[clamp(210px,34vw,280px)]">
              {sparks.map((s) => (
                <motion.span
                  key={s.id}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
                  style={{ width: s.size, height: s.size, background: s.color }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                  animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: s.delay, ease: "easeOut" }}
                />
              ))}

              <button
                type="button"
                onClick={handleOpen}
                aria-label="Open invitation"
                className="relative block w-full cursor-pointer"
              >
                <motion.div
                  animate={isOpen ? { y: 0 } : { y: [0, -6, 0] }}
                  transition={
                    isOpen ? { duration: 0.3 } : { duration: 3.6, repeat: Infinity, ease: "easeInOut" }
                  }
                  whileHover={isOpen ? undefined : { scale: 1.03 }}
                  style={{ filter: "drop-shadow(0 18px 30px rgba(26,26,26,0.14))" }}
                >
                  <svg viewBox="0 0 240 192" className="h-auto w-full overflow-visible">
                    <defs>
                      <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#efece4" />
                      </linearGradient>
                      <linearGradient id="flapInner" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#e9e5da" />
                        <stop offset="100%" stopColor="#f6f3ec" />
                      </linearGradient>
                      <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fdfdfb" />
                        <stop offset="100%" stopColor="#f3f1ea" />
                      </linearGradient>
                    </defs>

                    <ellipse cx="120" cy="184" rx="92" ry="7" fill="#1a1a1a" opacity="0.08" />

                    {/* opened flap, rising behind the card */}
                    <motion.g
                      initial={false}
                      animate={{ scaleY: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.36, ease: "easeOut", delay: isOpen ? 0.42 : 0 }}
                      style={{ originX: 0.5, originY: 1 }}
                    >
                      <polygon
                        points="10,50 120,-18 230,50"
                        fill="url(#flapInner)"
                        stroke="#1a1a1a"
                        strokeWidth="1.1"
                      />
                    </motion.g>

                    <rect
                      x="10"
                      y="50"
                      width="220"
                      height="122"
                      rx="2"
                      fill="url(#bodyGrad)"
                      stroke="#1a1a1a"
                      strokeWidth="1.1"
                    />

                    {/* card: tucked fully inside until the flap opens, then rises out */}
                    <motion.g
                      initial={false}
                      animate={{ y: isOpen ? -64 : 0 }}
                      transition={{ duration: 0.9, ease: EASE, delay: isOpen ? 0.5 : 0 }}
                    >
                      <rect x="42" y="58" width="156" height="106" fill="#ffffff" stroke="#e3e1da" strokeWidth="1" />
                      <text
                        x="120"
                        y="103"
                        textAnchor="middle"
                        fontFamily="'Cormorant Garamond', serif"
                        fontSize="23"
                        fill="#1a1a1a"
                      >
                        E &amp; J
                      </text>
                      <rect x="100" y="114" width="40" height="1.4" fill="#a98f5c" />
                      <line x1="68" y1="130" x2="172" y2="130" stroke="#e3e1da" strokeWidth="1" />
                      <line x1="80" y1="141" x2="160" y2="141" stroke="#e3e1da" strokeWidth="1" />
                    </motion.g>

                    {/* pocket front, so the card sits inside the envelope */}
                    <path
                      d="M10 50L120 118L230 50V170a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2Z"
                      fill="url(#bodyGrad)"
                      stroke="#1a1a1a"
                      strokeWidth="1.1"
                      strokeLinejoin="round"
                    />
                    <path d="M10 172L96 104M230 172L144 104" stroke="#d8d6d0" strokeWidth="1" />

                    {/* closed flap, folds away first */}
                    <motion.g
                      initial={false}
                      animate={{ scaleY: isOpen ? 0 : 1 }}
                      transition={{ duration: 0.32, ease: "easeIn", delay: isOpen ? 0.1 : 0 }}
                      style={{ originX: 0.5, originY: 0 }}
                    >
                      <polygon
                        points="10,50 120,122 230,50"
                        fill="url(#flapGrad)"
                        stroke="#1a1a1a"
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                      />
                    </motion.g>

                    {/* ribbon bow */}
                    <motion.g
                      initial={false}
                      animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.5 : 1, y: isOpen ? 10 : 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      style={{ originX: 0.5, originY: 0.22 }}
                    >
                      <path d="M120,122 C104,106 86,112 88,128 C90,142 108,140 120,124 Z" fill="#1a1a1a" />
                      <path d="M120,122 C136,106 154,112 152,128 C150,142 132,140 120,124 Z" fill="#1a1a1a" />
                      <path
                        d="M118,128 C102,142 100,154 114,172 C117,175 122,173 121,169 C110,158 112,149 122,137 Z"
                        fill="#1a1a1a"
                      />
                      <path
                        d="M122,128 C138,142 140,154 126,172 C123,175 118,173 119,169 C130,158 128,149 118,137 Z"
                        fill="#1a1a1a"
                      />
                      <circle cx="120" cy="124" r="8" fill="#1a1a1a" />
                      <circle cx="117" cy="121" r="2.2" fill="#3a3a3a" />
                    </motion.g>
                  </svg>
                </motion.div>
              </button>
            </motion.div>

            <motion.p
              variants={rise}
              className="mt-8 pl-[0.28em] text-[0.64rem] uppercase tracking-[0.28em] text-muted"
            >
              <motion.span
                className="inline-block"
                animate={{ opacity: isOpen ? 0 : [0.45, 1, 0.45] }}
                transition={isOpen ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap the envelope to open
              </motion.span>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
