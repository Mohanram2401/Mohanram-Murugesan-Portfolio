import { createFileRoute } from "@tanstack/react-router";

import { About } from "@/components/portfolio/About";
import { Certifications } from "@/components/portfolio/Certifications";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { Navbar } from "@/components/portfolio/Navbar";
import { Projects } from "@/components/portfolio/Projects";
import { SectionDivider } from "@/components/portfolio/SectionDivider";
import { TechMarquee } from "@/components/portfolio/TechMarquee";
import { Timeline } from "@/components/portfolio/Timeline";
import { ParallaxBackground } from "@/components/effects/ParallaxBackground";
import { useSettings } from "@/hooks/usePortfolioData";
import { defaultSettings } from "@/lib/profile";

const title = "Mohanram Murugesan — Cybersecurity Engineer & SOC Analyst";
const description =
  "Portfolio of Mohanram Murugesan: SOC analyst, SIEM engineer and VAPT specialist building detections, automation and security tooling.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: settings } = useSettings();
  const v = settings?.visibleSections ?? defaultSettings.visibleSections;

  return (
    <>
      <Navbar />
      <main className="relative">
        <ParallaxBackground />
        <Hero />
        {v.skills ? <TechMarquee /> : null}
        {v.about ? (
          <>
            <SectionDivider />
            <About />
          </>
        ) : null}
        {v.experience || v.education ? (
          <>
            <SectionDivider />
            <Timeline />
          </>
        ) : null}
        {v.projects ? (
          <>
            <SectionDivider />
            <Projects />
          </>
        ) : null}
        {v.certifications ? (
          <>
            <SectionDivider />
            <Certifications />
          </>
        ) : null}
        {v.contact ? (
          <>
            <SectionDivider />
            <Contact />
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
