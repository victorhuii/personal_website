import { useState } from "react";
import Sidebar, { MobileSectionNav } from "../components/Sidebar";
import { ProjectModal } from "../components/Project";
import {
  AboutSection, ExperienceSection, ProjectsSection, CommunitiesSection,
  PhilosophySection, ShelfSection,
} from "../components/Sections";
import useActiveSection from "../hooks/useActiveSection";

export default function AboutPage() {
  const { activeSection, activeShelf, setActiveSection, setActiveShelf } = useActiveSection();
  const [openProject, setOpenProject] = useState(null);

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

  return <>
    <main className="gutter site-main" style={{ flex: 1 }}>
      <div className="content-layout">
        <Sidebar activeSection={activeSection} activeShelf={activeShelf}
          onNavigate={navigateToSection} onShelfNavigate={navigateToShelf} />
        <div className="container">
          <MobileSectionNav activeSection={activeSection} onNavigate={navigateToSection} />
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection onOpen={setOpenProject} />
          <CommunitiesSection />
          <PhilosophySection />
          <ShelfSection />
        </div>
      </div>
    </main>
    {openProject && <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />}
  </>;
}
