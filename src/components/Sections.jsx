import { useRef, useState } from "react";
import { SITE, EXPERIENCE, COMMUNITIES, QUOTES, SHELF_COLLECTIONS } from "../content/siteContent";
import Reveal from "./Reveal";
import ShelfCollection from "./Shelf";
import InstagramIcon from "./InstagramIcon";
import CommunityPhotoDialog from "./CommunityPhotoDialog";
import useContentTransition from "../hooks/useContentTransition";
import useDisclosureMotion from "../hooks/useDisclosureMotion";
import { pulseConfirmation } from "../utils/motion";
import "../styles/experience.css";
import "../styles/community.css";
import "../styles/philosophy.css";

export { default as AboutSection } from "./AboutSection";

export function ExperienceSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabs = useRef([]);
  const detailRef = useRef(null);
  const transitionDetails = useContentTransition(detailRef);
  const selected = EXPERIENCE[selectedIndex];
  const selectExperience = index => {
    if (index !== selectedIndex) transitionDetails(() => setSelectedIndex(index));
  };

  const handleTabKeyDown = (event, index) => {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % EXPERIENCE.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + EXPERIENCE.length) % EXPERIENCE.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = EXPERIENCE.length - 1;
    else return;
    event.preventDefault();
    selectExperience(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="experience" className="experience-section">
      <div className="experience-block">
        <div className="experience-intro">
          <h2 className="h2">Experience</h2>
          <p>Where I’ve worked and what I’ve built.</p>
        </div>
        <div className="experience-layout">
          <div className="experience-tabs" role="tablist" aria-label="Experience" data-cursor-reveal="text">
            {EXPERIENCE.map((exp, index) => (
              <button
                key={exp.company}
                ref={node => { tabs.current[index] = node; }}
                type="button"
                role="tab"
                id={`experience-tab-${index}`}
                aria-controls="experience-detail"
                aria-selected={index === selectedIndex}
                tabIndex={index === selectedIndex ? 0 : -1}
                className={`experience-tab${index === selectedIndex ? " is-selected" : ""}`}
                onClick={() => selectExperience(index)}
                onKeyDown={event => handleTabKeyDown(event, index)}
              >
                <span className="experience-tab-top"><strong>{exp.role}</strong><small>{exp.period.split("–")[0].trim()}</small></span>
                <span className="experience-tab-company">{exp.company}</span>
              </button>
            ))}
          </div>
          <div
            id="experience-detail"
            className="experience-detail"
            role="tabpanel"
            data-cursor-reveal="text"
            aria-labelledby={`experience-tab-${selectedIndex}`}
            tabIndex={0}
          >
            <div className="experience-detail-content" ref={detailRef} key={selected.company}>
              <div className="experience-detail-heading">
                <div>
                  <h3>{selected.role}</h3>
                  <p className="experience-detail-meta"><span>{selected.company}</span><span>{selected.period}</span><span>{selected.location}</span></p>
                </div>
                <span className="experience-detail-logo" style={{ background: selected.logoBackground }}>
                  <img src={selected.logo} alt="" loading="lazy" />
                </span>
              </div>
              <p className="experience-detail-summary">{selected.summary}</p>
              <div className="experience-detail-body">
                <h4>Responsibilities</h4>
                <ul key={`work-${selected.company}`} className="experience-bullet-list">
                  {selected.highlights.map((highlight, index) => <li key={highlight} style={{ "--row-index": index }}>{highlight}</li>)}
                </ul>
              </div>
              <div className="experience-detail-skills">
                <h4>Skills &amp; tools</h4>
                <div className="experience-detail-tools" aria-label="Skills and tools">
                  {selected.tools.map((tool, index) => <span key={tool} style={{ "--row-index": index }}>{tool}</span>)}
                </div>
              </div>
              <div className="experience-detail-achievements">
                <h4>Key achievements</h4>
                <ul key={`achievements-${selected.company}`} className="experience-achievement-list">
                  {selected.achievements.map((achievement, index) => <li key={achievement} style={{ "--row-index": index }}>{achievement}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PolaroidCard({ photo, index, revealed = false, onOpen }) {
  return (
    <div data-cursor-reveal="image" data-cursor-revealed={revealed ? "true" : undefined} data-cursor-key={`community-photo-${photo.id}`} className="polaroid-card" style={{ "--tilt": `${[-2, 2, 0, -5][index % 4]}deg` }}>
      <figure className="polaroid-content">
        <div className="polaroid-photo" style={photo.ratio ? { aspectRatio: photo.ratio, height: "auto" } : undefined}>
          <div className="polaroid-image">
            {photo.src ? <img src={photo.src} alt={photo.caption} loading="lazy" style={{ objectPosition: photo.position || "center", objectFit: photo.fit || "cover", transform: photo.zoom ? `scale(${photo.zoom})` : undefined, transformOrigin: photo.zoomOrigin }} /> :
              <div className="polaroid-placeholder" aria-label="Photo placeholder"><span>✳</span><small>Photo coming soon</small></div>}
          </div>
          {photo.src && <button type="button" className="polaroid-open" aria-label={`View full image: ${photo.caption}`} onClick={event => onOpen(photo, event.currentTarget)} />}
        </div>
        <figcaption className="polaroid-caption">{photo.caption}</figcaption>
      </figure>
    </div>
  );
}

const COMMUNITY_PAGE_SIZE = 4;

function CommunityStory({ community }) {
  const [page, setPage] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const photosRef = useRef(null);
  const transitionPhotos = useContentTransition(photosRef);
  const pageCount = Math.ceil(community.photos.length / COMMUNITY_PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const firstPhoto = currentPage * COMMUNITY_PAGE_SIZE;
  const photos = community.photos.slice(firstPhoto, firstPhoto + COMMUNITY_PAGE_SIZE);
  const galleryId = `community-gallery-${community.id}`;

  return (
    <article className="community-story" id={`community-${community.id}`}>
      <div className="community-story-heading" data-cursor-reveal="text">
        <div className="community-story-identity">
          <span className="community-story-logo" aria-hidden="true">{community.logo ? <img src={community.logo} alt="" width="66" height="66" loading="lazy" /> : community.mark}</span>
          <h3>{community.name}</h3>
          <span className="community-social-links">
          {community.websiteUrl && <a className="community-instagram community-website" href={community.websiteUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`${community.name} website (opens in a new tab)`}>
            <svg viewBox="2 2 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></svg>
          </a>}
          <a className="community-instagram" href={community.instagramUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`${community.name} on Instagram (opens in a new tab)`}>
            <InstagramIcon />
          </a>
          </span>
        </div>
        <p>{community.description}</p>
      </div>
      <div ref={photosRef} id={galleryId} className="community-polaroids" role="group" aria-label={`${community.name} photos`}>{photos.map((photo, index) =>
        <PolaroidCard key={photo.id} photo={photo} index={index} revealed={currentPage > 0} onOpen={(photo, trigger) => setSelectedPhoto({ photo, trigger })} />)}</div>
      {selectedPhoto && <CommunityPhotoDialog photo={selectedPhoto.photo} trigger={selectedPhoto.trigger} onClose={() => setSelectedPhoto(null)} />}
      <div className="community-gallery-controls">
        <span className="community-gallery-status" role="status" aria-atomic="true">
          {photos.length ? `Photos ${firstPhoto + 1}–${firstPhoto + photos.length} of ${community.photos.length}` : "No photos yet"}
        </span>
        <button type="button" className="community-gallery-next"
          aria-label={`Next photos for ${community.name}`} aria-controls={galleryId}
          disabled={pageCount <= 1}
          onClick={event => {
            if (pageCount <= 1) return;
            transitionPhotos(() => setPage((currentPage + 1) % pageCount));
            pulseConfirmation(event.currentTarget);
          }}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg>
        </button>
      </div>
    </article>
  );
}

export function CommunitiesSection({ archiveOpen, onArchiveChange }) {
  const archiveRef = useRef(null);
  const archiveBodyRef = useRef(null);
  const toggleArchive = useDisclosureMotion(archiveRef, archiveBodyRef, archiveOpen, onArchiveChange);
  return (
    <section id="community" className="communities-section"><Reveal>
      <h2 className="h2" data-cursor-reveal="text">My Communities</h2>
      <p className="section-sub" data-cursor-reveal="text">{SITE.communitiesSubtitle}</p>
      <div className="community-stories">
        {COMMUNITIES.filter(community => !community.past).map(community => <CommunityStory community={community} key={community.id} />)}
        <details ref={archiveRef} className="community-archive" id="past-clubs" open={archiveOpen}>
          <summary onClick={toggleArchive} data-cursor-reveal="text" data-cursor-key="past-clubs-toggle" aria-controls="past-club-stories" aria-expanded={archiveOpen}>
            Past clubs
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
          </summary>
          <div id="past-club-stories" ref={archiveBodyRef}>
            {COMMUNITIES.filter(community => community.past).map(community => <CommunityStory community={community} key={community.id} />)}
          </div>
        </details>
      </div>
    </Reveal></section>
  );
}

function PhilosophySketch({ symbol }) {
  return <svg className={`philosophy-sketch philosophy-sketch-${symbol}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
    {symbol === "compass" && <>
      <circle cx="60" cy="60" r="43" /><circle cx="60" cy="60" r="33" strokeDasharray="1 7" />
      <path d="M60 7v13m0 80v13M7 60h13m80 0h13M24 24l9 9m54 54 9 9M24 96l9-9m54-54 9-9" />
      <path d="m77 31-9 37-25 21 9-37Z" /><path d="m77 31-25 21 16 16Z" fill="currentColor" /><circle cx="60" cy="60" r="3" fill="currentColor" />
    </>}
    {symbol === "bee" && <><ellipse cx="62" cy="67" rx="30" ry="18" /><path d="M51 51v32m16-34v36M91 64l11 3-11 4M35 58l-9-9m10 27-10 9" /><ellipse cx="51" cy="35" rx="11" ry="20" transform="rotate(-30 51 35)" /><ellipse cx="71" cy="35" rx="11" ry="20" transform="rotate(30 71 35)" /><circle cx="82" cy="63" r="2" fill="currentColor" /></>}
    {symbol === "steps" && <><path d="M16 100h23V77h23V54h23V31h20M24 58l57-40M66 18h15v15" /><path d="M16 111h89" strokeDasharray="2 5" /></>}
    {symbol === "knot" && <><rect x="15" y="45" width="63" height="32" rx="16" transform="rotate(-35 46 61)" /><rect x="42" y="45" width="63" height="32" rx="16" transform="rotate(-35 73 61)" /><path d="m23 24 8 7m58 57 8 7M15 39l10 2m70 38 10 2" /></>}
    {symbol === "sail" && <><path d="M62 15v72H26Zm7 15 29 57H69ZM21 94h81l-12 12H35Z" /><path d="M13 113q12-5 24 0t24 0 24 0 24 0" /></>}
    {symbol === "horizon" && <><path d="M15 75h90M31 75a29 29 0 0 1 58 0M60 22v13M23 37l9 9m56 0 9-9M28 90h64M42 102h36" /></>}
    {symbol === "diamond" && <><path d="m14 42 21-23h50l21 23-46 62Zm0 0h92M35 19l-7 23 32 62 32-62-7-23M28 42l32-23 32 23" /></>}
    {symbol === "moon" && <><path d="M72 15a42 42 0 1 0 33 63A35 35 0 0 1 72 15Z" /><path d="m91 18 3 10 10 3-10 3-3 10-3-10-10-3 10-3ZM22 17v12m-6-6h12m69 74v12m-6-6h12" /></>}
    {symbol === "bulb" && <><path d="M44 86v-8c0-10-14-17-14-35a30 30 0 0 1 60 0c0 18-14 25-14 35v8ZM44 96h32m-26 10h20M60 86V59m-11-9 11 9 11-9M60 2v6M9 43h10m82 0h10M21 10l8 8m62 0 8-8" /></>}
  </svg>;
}

export function PhilosophySection() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title"><Reveal>
      <span className="philosophy-eyebrow" data-cursor-reveal="text">A personal compass</span>
      <h2 id="philosophy-title" className="h2" data-cursor-reveal="text">Notes to live by.</h2>
      <p className="section-sub" data-cursor-reveal="text">{SITE.philosophySubtitle}</p>
      <div className="philosophy-notes">
        {QUOTES.map(quote => {
          const [before, after] = quote.text.split(quote.emphasis);
          return <article data-cursor-reveal="text" className={`philosophy-note philosophy-note-${quote.id}`} key={quote.id}>
            <PhilosophySketch symbol={quote.symbol} />
            <blockquote>{before}<em>{quote.emphasis}</em>{after}</blockquote>
          </article>;
        })}
      </div>
    </Reveal></section>
  );
}

export function ShelfSection() {
  return (
    <section id="shelf"><Reveal>
      <h2 className="h2" data-cursor-reveal="text">Shelf</h2>
      <p className="legend" data-cursor-reveal="text"><span className="star">★</span> Favorites</p>
      <div className="shelf-collections">
        {SHELF_COLLECTIONS.map(collection => <ShelfCollection key={collection.id} collection={collection} />)}
      </div>
    </Reveal></section>
  );
}
