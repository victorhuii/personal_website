import { useState } from "react";
import { SITE, EXPERIENCE, PROJECTS, COMMUNITIES, QUOTES, SHELF_COLLECTIONS } from "../content/siteContent";
import Reveal from "./Reveal";
import ProjectCard from "./Project";
import ShelfCollection from "./Shelf";

export { default as AboutSection } from "./AboutSection";

export function ExperienceSection() {
  return (
    <section id="experience"><Reveal>
      <h2 className="h2">Experience</h2>
      <hr className="divider" style={{ marginBottom: 0 }} />
      {EXPERIENCE.map(exp => (
        <div className="row" key={exp.company}>
          <div><span className="row-title">{exp.company}</span><span className="row-sub">{exp.role}</span></div>
          <div className="row-end"><span className="tag">{exp.tag}</span><span className="period">{exp.period}</span></div>
        </div>
      ))}
    </Reveal></section>
  );
}

export function ProjectsSection({ onOpen }) {
  return (
    <section id="projects" style={{ marginTop: 32 }}>
      <Reveal>
        <div className="project-grid">
          {PROJECTS.map((project, index) => <ProjectCard key={project.company} project={project} index={index} onOpen={onOpen} />)}
        </div>
      </Reveal>
    </section>
  );
}

function PolaroidCard({ photo, index }) {
  return (
    <figure className="polaroid-card" style={{ "--tilt": `${[-2, 1.5, -1.25, 2][index % 4]}deg` }}>
      <div className="polaroid-image">
        {photo.src ? <img src={photo.src} alt={photo.caption} loading="lazy" /> :
          <div className="polaroid-placeholder" aria-label="Photo placeholder"><span>✳</span><small>Photo coming soon</small></div>}
      </div>
      <figcaption className="polaroid-caption">{photo.caption}</figcaption>
    </figure>
  );
}

export function CommunitiesSection() {
  const [activeCommunity, setActiveCommunity] = useState(COMMUNITIES[0]?.id);
  return (
    <section id="community"><Reveal>
      <h2 className="h2">My Communities</h2>
      <p className="section-sub">{SITE.communitiesSubtitle}</p>
      <div className="community-layout">
        <div className="community-sidebar" role="tablist" aria-label="Communities">
          {COMMUNITIES.map(community => <button type="button" role="tab"
            aria-selected={activeCommunity === community.id} aria-controls={`community-panel-${community.id}`}
            key={community.id} className={`community-tab ${activeCommunity === community.id ? "active" : ""}`}
            onClick={() => setActiveCommunity(community.id)}>
            <span>{community.name}</span><span aria-hidden="true">↗</span>
          </button>)}
        </div>
        {COMMUNITIES.map(community => (
          <div role="tabpanel" id={`community-panel-${community.id}`} key={community.id}
            hidden={activeCommunity !== community.id} className="community-panel">
            <div className="community-heading"><h3>{community.name}</h3><p>{community.description}</p></div>
            <div className="polaroid-grid">{community.photos.map((photo, index) =>
              <PolaroidCard key={photo.id} photo={photo} index={index} />)}</div>
          </div>
        ))}
      </div>
    </Reveal></section>
  );
}

export function PhilosophySection() {
  return (
    <section id="philosophy"><Reveal>
      <h2 className="h2">My Favorite Quotes</h2>
      <p className="section-sub">{SITE.philosophySubtitle}</p>
      <div className="quotes">
        {QUOTES.map((quote, index) => <div className="quote-card" key={index}>
          <p className="quote-text">“{quote.text}”</p><p className="quote-author">{quote.author}</p>
        </div>)}
      </div>
    </Reveal></section>
  );
}

export function ShelfSection() {
  return (
    <section id="shelf"><Reveal>
      <h2 className="h2">Shelf</h2>
      <p className="legend"><span className="star">★</span> Favorites</p>
      <div className="shelf-collections">
        {SHELF_COLLECTIONS.map(collection => <ShelfCollection key={collection.id} collection={collection} />)}
      </div>
    </Reveal></section>
  );
}
