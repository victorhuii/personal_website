import { useCallback, useState } from "react";
import WorkCover from "../components/WorkCover";
import WorkProjectDialog from "../components/WorkProjectDialog";
import { WORK_INTRO, WORK_PROJECTS } from "../content/workProjects";
import "../styles/work.css";

export default function WorkPage() {
  const [selected, setSelected] = useState(null);
  const closed = useCallback(() => setSelected(null), []);
  return <>
    <main className="work-main gutter">
      <div className="work-container">
        <div className="work-intro"><h2>{WORK_INTRO.heading}</h2><p>{WORK_INTRO.description}</p></div>
        <div className="work-grid">
          {WORK_PROJECTS.map((project, index) => <button type="button" className="work-card" key={project.id}
            style={{ "--work-stagger": `${index * 80}ms` }} onClick={() => setSelected(project)}
            aria-haspopup="dialog" aria-controls="work-project-dialog" aria-label={`Open ${project.title}${project.template ? " template" : ""}`}>
            <div className="work-card-frame"><WorkCover project={project} />
              <span className="work-card-pill">{project.title}<span>{project.template ? " · Template" : project.year ? ` · ${project.year}` : ""}</span></span>
            </div>
            <span className="work-card-mobile-title">{project.title}<span>{project.template ? " · Template" : project.year ? ` · ${project.year}` : ""}</span></span>
            <span className="work-card-description">{project.summary}</span>
          </button>)}
        </div>
      </div>
    </main>
    {selected && <WorkProjectDialog project={selected} projects={WORK_PROJECTS} onSelect={setSelected} onClosed={closed} />}
  </>;
}
