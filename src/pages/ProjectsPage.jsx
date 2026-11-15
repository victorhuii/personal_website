import { useRef } from "react";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import { MARS_TERRAIN } from "../content/marsTerrain";
import { MISSION_GUARD } from "../content/missionGuard";
import useCursorReveals from "../hooks/useCursorReveals";
import "../styles/work.css";
import "../styles/project-study.css";

export default function ProjectsPage() {
  const rootRef = useRef(null);
  useCursorReveals(rootRef, true, 100);
  return (
    <main className="work-main projects-main gutter" ref={rootRef} data-cursor-root data-cursor-scope="projects">
      <div className="work-container projects-container">
        <FeaturedProjectCard project={MISSION_GUARD} />
        <FeaturedProjectCard project={MARS_TERRAIN} />
      </div>
      <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />
    </main>
  );
}
