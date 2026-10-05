import { FloralDivider } from "./Florals";
import PauseOffscreen from "./PauseOffscreen";
import Reveal from "./Reveal";

/** A swaying floral garland that separates two sections. */
export default function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`px-6 ${className}`} aria-hidden="true">
      <Reveal className="mx-auto w-full max-w-[520px]">
        <PauseOffscreen>
          <FloralDivider />
        </PauseOffscreen>
      </Reveal>
    </div>
  );
}
