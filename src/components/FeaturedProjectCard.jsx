export function ProjectLinks({ project, caseStudy = false }) {
  return <div className="featured-project-links">
    {caseStudy && <a className="project-action" href={project.route}>Read the case study <span aria-hidden="true">→</span></a>}
    {project.links.map((link, index) => <a className={caseStudy ? "project-text-link" : `project-action${index ? " project-action-secondary" : ""}`} href={link.href}
      key={link.label} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} ${link.label} (opens in a new tab)`}>
      {link.label} <span aria-hidden="true">↗</span>
    </a>)}
  </div>;
}

export default function FeaturedProjectCard({ project }) {
  return <article className="featured-project" aria-labelledby={`project-${project.id}`}>
    <a className="work-card featured-project-cover" href={project.route} aria-label={`Read the ${project.title} case study`}
      data-cursor-reveal="image" data-cursor-key={`${project.id}-cover`}>
      <div className="work-card-frame">
        <img src={project.dashboard.src} alt={project.dashboard.alt} width={project.dashboard.width} height={project.dashboard.height} fetchPriority="high" />
        <span className="work-card-pill">{project.title}</span>
      </div>
      <span className="work-card-description">Explore the research and the application <span aria-hidden="true">↗</span></span>
    </a>
    <div className="featured-project-copy" data-cursor-reveal="text" data-cursor-key={`${project.id}-description`}>
      <p className="project-kicker">Featured project</p>
      <h3 id={`project-${project.id}`}><a href={project.route}>{project.title}</a></h3>
      <p className="featured-project-subtitle">{project.subtitle}</p>
      <p>{project.description}</p>
      <ul className="project-stack" aria-label="Technologies">{project.stack.map(technology => <li key={technology}>{technology}</li>)}</ul>
      <ProjectLinks project={project} caseStudy />
    </div>
  </article>;
}
