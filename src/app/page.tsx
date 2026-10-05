import Intro from "@/components/Intro";
import Countdown from "@/components/Countdown";
import Timeline from "@/components/Timeline";
import PhotoSection from "@/components/PhotoSection";
import Gallery from "@/components/Gallery";
import Closing from "@/components/Closing";
import SectionDivider from "@/components/SectionDivider";
import { FloralDefs } from "@/components/Florals";

export default function Home() {
  return (
    <>
      <FloralDefs />

      <Intro />

      <Countdown />

      <Timeline />

      <SectionDivider className="pb-[clamp(60px,10vh,120px)]" />

      <PhotoSection
        src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop"
        eyebrow="The Details"
        title="Dress Code"
      >
        <p className="text-[#4a4a46] leading-[1.8] mb-3.5 text-[0.98rem]">
          Semi-formal and elegant. Feel free to add a touch of pastel to match our
          garden-inspired palette of ivory, sage, and champagne gold.
        </p>
        <p className="text-[#4a4a46] leading-[1.8] text-[0.98rem]">
          Evenings by the coast can turn cool &mdash; a light jacket or wrap is a good idea for
          the dance floor under the stars.
        </p>
      </PhotoSection>

      <PhotoSection
        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1200&auto=format&fit=crop"
        eyebrow="Location"
        title="Stay at Obira Castle"
        reverse
      >
        <ul className="list-none">
          {[
            ["Accommodation", "Up to 42 guests"],
            ["Suites", "Elegant & luxury"],
            ["Included", "Buffet breakfast, pool & garden access"],
            ["Availability", "Limited — reserve early"],
            ["Rates", "From $250 / night"],
          ].map(([label, value]) => (
            <li
              key={label}
              className="flex justify-between gap-4 py-2.5 border-b border-line text-[0.92rem] text-[#4a4a46] max-sm:flex-col max-sm:gap-1 max-sm:items-start"
            >
              <span className="text-ink tracking-[0.04em]">{label}</span>
              <span className="max-sm:text-muted max-sm:text-[0.86rem]">{value}</span>
            </li>
          ))}
        </ul>
      </PhotoSection>

      <SectionDivider className="pt-[clamp(60px,10vh,120px)]" />

      <Gallery />

      <Closing />
    </>
  );
}
