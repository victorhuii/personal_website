import { useEffect, useState } from "react";

function Cover({ project, rounded = true }) {
  const style = { background: `linear-gradient(120deg, ${project.hue.join(",")})`, backgroundSize: "300% 300%" };
  return (
    <div className="cover" style={rounded ? undefined : { borderRadius: 0 }}>
      {project.video ? <video src={project.video} autoPlay muted loop playsInline />
        : project.image ? <img src={project.image} alt={project.company} />
          : <div className="cover-fallback" style={style}><span>{project.company}</span></div>}
    </div>
  );
}

export default function ProjectCard({ project, index, onOpen }) {
  return (
    <button className="project-card" style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => onOpen(project)} aria-label={`Open ${project.company} project`}>
      <Cover project={project} />
      <span className="project-pill"><b>{project.company}</b><i>•</i><em>{project.year}</em></span>
    </button>
  );
}

export function ProjectModal({ project, onClose }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onKey = event => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="scrim" onClick={onClose}>
      <div className={`modal ${expanded ? "expanded" : ""}`} role="dialog" aria-modal="true"
        aria-label={project.company} onClick={event => event.stopPropagation()}>
        <button className="icon-btn left" onClick={() => setExpanded(value => !value)} aria-label="Expand">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9" /></svg>
        </button>
        <button className="icon-btn right" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
        </button>
        <div className="modal-body">
          <div className="modal-mark">{project.company[0]}</div>
          <h2 className="modal-title">{project.company}</h2>
          <div className="modal-meta">
            <div><span>Year</span><p>{project.year}</p></div>
            <div><span>Role</span><p>{project.role}</p></div>
            <div><span>Org</span><p>{project.org}</p></div>
            <div><span>With</span><p>{project.with.map((person, index) => <span key={`${person}-${index}`} className="block">{person}</span>)}</p></div>
          </div>
          <hr className="divider" />
          <div className="modal-media"><Cover project={project} /></div>
          <div className="modal-cols">
            <div><span className="eyebrow">The mission</span><p className="mission">{project.mission}</p></div>
            <div className="prose">
              {project.body.map((paragraph, index) => <p key={index} className={index === 0 ? "lead" : ""}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
