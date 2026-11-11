import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import WorkCover from "./WorkCover";
import useContentTransition from "../hooks/useContentTransition";
import { animateDialog } from "../utils/motion";

export default function WorkProjectDialog({ project, projects, triggerRef, onSelect, onClosed }) {
  const dialogRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);
  const backdropDown = useRef(false);
  const bodyRef = useRef(null);
  const transitionProject = useContentTransition(bodyRef);
  const [expanded, setExpanded] = useState(false);
  const [closing, setClosing] = useState(false);
  const close = useCallback(() => setClosing(true), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    const entrance = animateDialog(dialog, triggerRef.current);
    return () => {
      entrance?.cancel();
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [triggerRef]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    closeRef.current?.focus({ preventScroll: true });
  }, [project.id]);

  useEffect(() => {
    if (!closing) return;
    const dialog = dialogRef.current;
    const exit = animateDialog(dialog, triggerRef.current, true);
    if (!exit) { dialog.close(); return; }
    exit.finished.then(() => dialog.close(), () => {});
    return () => exit.cancel();
  }, [closing, triggerRef]);

  const outside = event => {
    const bounds = dialogRef.current.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  };
  const related = projects.filter(item => item.id !== project.id).slice(0, 2);
  const links = (project.links || []).filter(link => link.href);

  return createPortal(
    <dialog id="work-project-dialog" ref={dialogRef}
      className={`work-dialog${expanded ? " work-dialog--expanded" : ""}${closing ? " is-closing" : ""}`}
      aria-labelledby={`work-title-${project.id}`} onClose={event => {
        // Ignore a queued cleanup event if StrictMode has reopened the dialog.
        if (!event.currentTarget.open) onClosed();
      }}
      onCancel={event => { event.preventDefault(); close(); }}
      onPointerDown={event => { backdropDown.current = outside(event); }}
      onClick={event => { if (backdropDown.current && outside(event)) close(); backdropDown.current = false; }}>
      <div className="work-dialog-scroll" ref={scrollRef}>
        <div className="work-dialog-toolbar">
          <button type="button" className="work-dialog-control" disabled={closing}
            onClick={() => setExpanded(value => !value)} aria-pressed={expanded}
            aria-label={expanded ? "Restore project window" : "Expand project window"}>
            <span className="motion-icon-stack" aria-hidden="true">
              <svg className={`motion-icon${expanded ? "" : " is-active"}`} viewBox="0 0 20 20" fill="none"><path d="M13 3h4v4M7 17H3v-4M17 3l-5 5M3 17l5-5" /></svg>
              <svg className={`motion-icon${expanded ? " is-active" : ""}`} viewBox="0 0 20 20" fill="none"><path d="M3 7h4V3M17 13h-4v4M7 7 2 2m11 11 5 5" /></svg>
            </span>
          </button>
          <button type="button" className="work-dialog-control" ref={closeRef} disabled={closing} onClick={close} aria-label="Close project">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
          </button>
        </div>
        <article ref={bodyRef} className="work-dialog-body" key={project.id}>
          {project.logo ? <div className="work-project-mark work-project-company-logo" style={{ background: project.logoBackground }}>
            <img src={project.logo} alt="" />
          </div> : <div className="work-project-mark" aria-hidden="true">{project.mark || project.title[0]}</div>}
          <h2 id={`work-title-${project.id}`} className="work-project-title">{project.title}</h2>
          {project.template && <p className="work-template-label">Project template — replace with your own work</p>}
          <dl className="work-project-meta">
            <div><dt>Year</dt><dd>{project.year || "—"}</dd></div>
            <div><dt>Role</dt><dd>{project.role}</dd></div>
            {project.kind === "experience" ? <>
              <div><dt>Org</dt><dd>{project.org || "—"}</dd></div>
              <div><dt>With</dt><dd>{project.with?.length ? project.with.map(person => <span className="work-project-person" key={person}>{person}</span>) : "—"}</dd></div>
            </> : <>
              <div><dt>Focus</dt><dd>{project.category}</dd></div>
              <div><dt>Stack</dt><dd>{project.stack?.length ? project.stack.join(" · ") : "—"}</dd></div>
            </>}
          </dl>
          {links.length > 0 && <nav className="work-project-links" aria-label="Project resources">
            {links.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true"> ↗</span></a>)}
          </nav>}
          <div className="work-project-hero"><WorkCover project={project} priority /></div>
          <section className="work-detail-split">
            <div><p className="work-eyebrow">{project.overviewLabel || "The problem"}</p><h3>{project.problem}</h3></div>
            <div className="work-prose">
              {(project.overview || []).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {project.overviewBullets?.length > 0 && <ul>{project.overviewBullets.map((bullet, index) => <li key={bullet} style={{ "--row-index": index }}>{bullet}</li>)}</ul>}
            </div>
          </section>
          {(project.sections || []).map(section => <section className="work-detail-split work-detail-section" key={section.label}>
            <div><p className="work-eyebrow">{section.label}</p>{section.title && <h3>{section.title}</h3>}</div>
            <div className="work-prose">
              {(section.paragraphs || []).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {section.bullets?.length > 0 && <ul>{section.bullets.map((item, index) => <li key={index} style={{ "--row-index": index }}>{item}</li>)}</ul>}
            </div>
          </section>)}
          {project.gallery?.length > 0 && <section className="work-gallery">
            <p className="work-eyebrow">Screenshots & demo</p>
            {project.gallery.map((item, index) => <figure className="work-gallery-item" key={index}>
              {item.title && <h3>{item.title}</h3>}
              {item.video ? <video src={item.video} poster={item.poster || undefined} controls playsInline preload="metadata" aria-label={item.title || "Project walkthrough"} />
                : item.image ? <img src={item.image} alt={item.alt || item.title || "Project screenshot"} loading="lazy" /> : null}
              {item.caption && <figcaption>{item.caption}</figcaption>}
            </figure>)}
          </section>}
          {related.length > 0 && <section className="work-related">
            <p className="work-eyebrow">More work</p>
            <div className="work-related-grid">{related.map(item => <button type="button" className="work-related-card" key={item.id} disabled={closing} onClick={() => transitionProject(() => onSelect(item))}>
              <div className="work-card-frame"><WorkCover project={item} /></div>
              <span>{item.title}<span className="work-related-year">{item.template ? " · Template" : item.year ? ` · ${item.year}` : ""}</span></span>
            </button>)}</div>
          </section>}
        </article>
      </div>
    </dialog>, document.body,
  );
}
