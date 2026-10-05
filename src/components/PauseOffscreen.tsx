"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { useInView } from "framer-motion";

/** Pauses the botanical sway/breathe animations inside it while it is scrolled out of view. */
export default function PauseOffscreen({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "120px 0px" });

  return (
    <div ref={ref} className={`${className} ${inView ? "" : "motion-paused"}`}>
      {children}
    </div>
  );
}
