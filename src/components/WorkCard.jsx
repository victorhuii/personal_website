import WorkCover from "./WorkCover";

export default function WorkCard({ project, index, onOpen, cursorReveal = false }) {
  const suffix = project.template ? " · Template" : project.year ? ` · ${project.year}` : "";
  return (
    <button type="button" className="work-card" data-cursor-reveal={cursorReveal ? "image" : undefined}
      data-cursor-key={cursorReveal ? project.id : undefined}
      style={{ "--work-stagger": `${index * 30}ms` }} onClick={event => onOpen(project, event.currentTarget)}
      aria-haspopup="dialog" aria-controls="work-project-dialog" aria-label={`Open ${project.title}${project.template ? " template" : ""}`}>
      <div className="work-card-frame">
        <WorkCover project={project} />
        <span className="work-card-pill">{project.title}<span>{suffix}</span></span>
      </div>
      <span className="work-card-mobile-title">{project.title}<span>{suffix}</span></span>
      <span className="work-card-description">{project.summary}</span>
    </button>
  );
}
