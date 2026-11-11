import { useRef, useState } from "react";
import Footer from "../components/Footer";
import Sidebar, { MobileSectionNav } from "../components/Sidebar";
import {
  AboutSection, ExperienceSection, CommunitiesSection,
  PhilosophySection, ShelfSection,
} from "../components/Sections";
import useActiveSection from "../hooks/useActiveSection";
import useCursorReveals from "../hooks/useCursorReveals";
import "../styles/about-cursor-reveals.css";

export default function AboutPage() {
  const rootRef = useRef(null);
  const [archiveOpen, setArchiveOpen] = useState(false);
  useCursorReveals(rootRef, true, 100);
  const { activeSection, activeShelf, activeCommunity, setActiveSection, setActiveShelf, setActiveCommunity } = useActiveSection();

  const navigateToSection = link => {
    setActiveSection(link);
    document.getElementById(link === "Hi!" ? "about" : link.toLowerCase())
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const navigateToShelf = id => {
    setActiveSection("Shelf");
    setActiveShelf(id);
    document.getElementById(`shelf-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const navigateToCommunity = id => {
    setActiveSection("Community");
    setActiveCommunity(id);
    document.getElementById(`community-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <div className="about-cursor-page" ref={rootRef} data-cursor-scope="about">
    <main className="gutter site-main" style={{ flex: 1 }}>
      <div className="content-layout">
        <Sidebar activeSection={activeSection} activeShelf={activeShelf} activeCommunity={activeCommunity} archiveOpen={archiveOpen}
          onNavigate={navigateToSection} onShelfNavigate={navigateToShelf} onCommunityNavigate={navigateToCommunity} />
        <div className="container">
          <MobileSectionNav activeSection={activeSection} onNavigate={navigateToSection} />
          <AboutSection />
          <ExperienceSection />
          <CommunitiesSection archiveOpen={archiveOpen} onArchiveChange={setArchiveOpen} />
          <PhilosophySection />
          <ShelfSection />
        </div>
      </div>
    </main>
    <Footer cursorReveal />
    <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />
  </div>;
}
