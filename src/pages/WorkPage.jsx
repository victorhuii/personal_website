import { useCallback, useRef, useState } from "react";
import WorkCard from "../components/WorkCard";
import WorkProjectDialog from "../components/WorkProjectDialog";
import useCursorReveals from "../hooks/useCursorReveals";
import { COMPANY_WORK } from "../content/workProjects";
import "../styles/work.css";

export default function WorkPage() {
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  useCursorReveals(rootRef, true, 100);
  const [selected, setSelected] = useState(null);
  const closed = useCallback(() => setSelected(null), []);
  const open = (project, trigger) => { triggerRef.current = trigger; setSelected(project); };
  return <>
    <main className="work-main gutter" ref={rootRef} data-cursor-root data-cursor-scope="work">
      <div className="work-container">
        <section id="work-companies" className="work-grid" aria-label="Company work">
          {COMPANY_WORK.map((project, index) => <WorkCard key={project.id} project={project} index={index} onOpen={open} cursorReveal />)}
        </section>
      </div>
      <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />
    </main>
    {selected && <WorkProjectDialog project={selected} projects={COMPANY_WORK} triggerRef={triggerRef} onSelect={setSelected} onClosed={closed} />}
  </>;
}
