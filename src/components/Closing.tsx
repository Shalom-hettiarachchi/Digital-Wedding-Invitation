"use client";

import { FloralCorner } from "./Florals";
import PauseOffscreen from "./PauseOffscreen";
import Reveal from "./Reveal";
import { Ornament } from "./SectionHeading";

// The corner florals are this wide and tall; the section reserves the same space beneath the text.
const FLORAL = "clamp(172px,34vw,340px)";

export default function Closing() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-[clamp(60px,10vh,120px)] text-center"
      style={{ paddingBottom: FLORAL }}
    >
      <Reveal className="relative z-10">
        <Ornament />
        <p className="mt-7 font-script text-[clamp(2.2rem,5vw,3rem)] leading-none text-gold">With love</p>
        <h2 className="mx-auto mt-5 max-w-[620px] pl-[0.14em] font-serif text-[clamp(1.35rem,3.4vw,1.9rem)] font-light uppercase leading-snug tracking-[0.14em]">
          We can&apos;t wait to celebrate with you
        </h2>
        <p className="mx-auto mt-6 max-w-[480px] leading-[1.9] text-[#4a4a46]">
          Your presence means more to us than any gift. Come as you are, and bring your dancing shoes.
        </p>
      </Reveal>

      <footer className="relative z-10 mt-14 pl-[0.2em] text-[0.72rem] uppercase tracking-[0.2em] text-muted lining-nums lg:absolute lg:inset-x-0 lg:bottom-10 lg:mt-0">
        Emma &amp; James &middot; 18.06.2027
      </footer>

      <div className="pointer-events-none absolute bottom-0 left-0" style={{ width: FLORAL }}>
        <PauseOffscreen className="-scale-y-100">
          <FloralCorner />
        </PauseOffscreen>
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0" style={{ width: FLORAL }}>
        <PauseOffscreen className="rotate-180">
          <FloralCorner />
        </PauseOffscreen>
      </div>
    </section>
  );
}
