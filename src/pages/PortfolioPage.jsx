import { useEffect, useId, useMemo, useRef, useState } from "react";
import Footer from "../components/Footer";
import CompactNavigation from "../components/CompactNavigation";
import { SITE } from "../content/siteContent";
import { PHOTO_CATEGORIES, PORTFOLIO, PORTFOLIO_PHOTOS } from "../content/portfolioContent";
import useCursorReveals from "../hooks/useCursorReveals";
import useContentTransition from "../hooks/useContentTransition";
import { animateDialog, animatePhotoLayout, pulseConfirmation } from "../utils/motion";
import { createPhotoSpreads } from "../utils/photoSpreads";
import "../styles/portfolio.css";
import "../styles/portfolio-spreads.css";

function spreadFrameStyle(desktop, mobile) {
  return Object.fromEntries(["x", "y", "width", "height"].flatMap(key => [
    [`--spread-${key}`, `${desktop[key] * 100}%`],
    [`--spread-mobile-${key}`, `${mobile[key] * 100}%`],
  ]));
}

function PhotoSpread({ spread, index, total, onSelect }) {
  const subjects = [...new Set(spread.photos.map(photo => PHOTO_CATEGORIES.find(category => category.id === photo.category)?.label))];
  return <div className="portfolio-spread" role="group" aria-label={`Photo spread ${index + 1} of ${total}`}>
    <div className="portfolio-spread-paper">
      <div className="portfolio-spread-canvas" style={{ "--spread-ratio": spread.ratio }}>
        {spread.photos.map((photo, photoIndex) => <button type="button" key={photo.id}
          className="portfolio-photo" data-photo-id={photo.id} data-category={photo.category}
          style={spreadFrameStyle(spread.desktop[photo.id], spread.mobile[photo.id])}
          onClick={event => onSelect(photo.id, event.currentTarget)} aria-label={`View photograph: ${photo.title}`} aria-haspopup="dialog">
          <span className="portfolio-photo-placeholder" aria-hidden="true"><span>{String(photoIndex + 1).padStart(2, "0")}</span><span>+</span></span>
          <span className="portfolio-photo-image" data-cursor-reveal="image" data-reveal-priority="110"><img
            src={photo.src} alt={photo.alt} loading="lazy" decoding="async" style={{ objectPosition: photo.position ?? "center" }} /></span>
          <span className="portfolio-photo-corners" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="portfolio-photo-caption"><span>{photo.title}</span><span aria-hidden="true">↗</span></span>
        </button>)}
      </div>
      <div className="portfolio-spread-caption">
        <span>{subjects.join(" / ")}</span>
        <span>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} <span aria-hidden="true">·</span> {spread.photos.length} frames</span>
      </div>
    </div>
  </div>;
}

function Arrow({ direction = "down" }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: `rotate(${direction === "left" ? 90 : direction === "right" ? -90 : 0}deg)` }}>
    <path d="m5 9 7 7 7-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

function PortfolioCover({ onExplore, onReady, ready }) {
  return <section className={`portfolio-cover${ready ? " is-ready" : ""}`} aria-labelledby="portfolio-title">
    <header className="portfolio-topbar" data-cursor-reveal="text" data-cursor-key="main-navigation" data-reveal-priority="2">
      <CompactNavigation page="portfolio" />
    </header>
    <div className="portfolio-cover-layout">
      <span className="portfolio-cover-credit" data-cursor-reveal="text" data-reveal-priority="4">{PORTFOLIO.credit}</span>
      <div className="portfolio-cover-photo">
        <div className="portfolio-cover-image" data-cursor-reveal="image" data-reveal-priority="0"><img src={PORTFOLIO.heroImage} alt={PORTFOLIO.heroAlt} fetchPriority="high" onLoad={onReady} onError={onReady} /></div>
      </div>
      <div className="portfolio-cover-copy" data-cursor-reveal="text" data-reveal-priority="1">
        <h1 id="portfolio-title">{PORTFOLIO.title}</h1>
        <p>{PORTFOLIO.description}</p>
      </div>
    </div>
    <button type="button" className="portfolio-scroll" onClick={onExplore} aria-label="Explore the photo collection" data-cursor-reveal="text" data-reveal-priority="5"><Arrow /></button>
  </section>;
}

function RevealCursors() {
  return <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />;
}

function PhotoLightbox({ photos, index, triggerRef, onChange, onClose }) {
  const dialogRef = useRef(null);
  const imageRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const transitionPhoto = useContentTransition(imageRef);
  const close = () => setClosing(true);
  const changePhoto = next => { if (!closing) transitionPhoto(() => onChange(next)); };
  const titleId = useId();
  const photo = photos[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    dialog.showModal();
    const entrance = animateDialog(dialog, triggerRef.current);
    document.body.style.overflow = "hidden";
    return () => {
      entrance?.cancel();
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [triggerRef]);

  useEffect(() => {
    if (!closing) return;
    const dialog = dialogRef.current;
    const exit = animateDialog(dialog, triggerRef.current, true);
    if (!exit) { dialog.close(); return; }
    exit.finished.then(() => dialog.close(), () => {});
    return () => exit.cancel();
  }, [closing, triggerRef]);

  return <dialog className="portfolio-lightbox" ref={dialogRef} aria-labelledby={titleId}
    onClose={event => { if (!event.currentTarget.open) onClose(); }}
    onCancel={event => { event.preventDefault(); close(); }}
    onClick={event => { if (event.target === event.currentTarget) close(); }}
    onKeyDown={event => {
      if (event.key === "ArrowRight") { event.preventDefault(); changePhoto((index + 1) % photos.length); }
      if (event.key === "ArrowLeft") { event.preventDefault(); changePhoto((index - 1 + photos.length) % photos.length); }
    }}>
    <div className="portfolio-lightbox-header">
      <span>{SITE.name} <span className="portfolio-lightbox-divider">/</span> photography</span>
      <button type="button" className="portfolio-lightbox-close" onClick={close} disabled={closing} aria-label="Close photograph">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.2" /></svg>
      </button>
    </div>
    <div className="portfolio-lightbox-stage">
      <button type="button" className="portfolio-lightbox-previous" disabled={closing} onClick={() => changePhoto((index - 1 + photos.length) % photos.length)} aria-label="Previous photograph"><Arrow direction="left" /></button>
      <img ref={imageRef} src={photo.src} alt={photo.alt} key={photo.id} />
      <button type="button" className="portfolio-lightbox-next" disabled={closing} onClick={() => changePhoto((index + 1) % photos.length)} aria-label="Next photograph"><Arrow direction="right" /></button>
    </div>
    <div className="portfolio-lightbox-caption">
      <div><h2 id={titleId}>{photo.title}</h2><span>{PHOTO_CATEGORIES.find(category => category.id === photo.category)?.label}</span></div>
      <span className="portfolio-lightbox-count" aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
    </div>
  </dialog>;
}

export default function PortfolioPage() {
  const rootRef = useRef(null);
  const galleryRef = useRef(null);
  const spreadsRef = useRef(null);
  const photoTriggerRef = useRef(null);
  const transitionSpreads = useContentTransition(spreadsRef);
  const [coverReady, setCoverReady] = useState(false);
  const [category, setCategory] = useState("all");
  const [layoutSeed, setLayoutSeed] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const photos = useMemo(() => PORTFOLIO_PHOTOS.filter(photo => category === "all" || photo.category === category), [category]);
  const spreads = useMemo(() => createPhotoSpreads(photos, layoutSeed), [photos, layoutSeed]);
  const currentCategory = PHOTO_CATEGORIES.find(item => item.id === category);
  useCursorReveals(rootRef, coverReady);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  const chooseCategory = id => {
    if (id !== category) transitionSpreads(() => setCategory(id));
    scrollToGallery();
  };

  return <div className="portfolio-page" ref={rootRef} data-cursor-scope="photography">
    <a className="portfolio-skip-link" href="#portfolio-collection" onClick={event => {
      event.preventDefault();
      const collection = rootRef.current?.querySelector("#portfolio-collection");
      collection?.focus({ preventScroll: true });
      collection?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }}>Skip to photographs</a>
    <main className="portfolio-main">
      <PortfolioCover onExplore={scrollToGallery} ready={coverReady} onReady={() => setCoverReady(true)} />

      <nav className="portfolio-gallery-nav" aria-label="Photo categories" ref={galleryRef}>
        <div className="portfolio-gallery-nav-inner">
          <a className="portfolio-gallery-signature" href="#/photography" data-cursor-reveal="text">VICTOR HUI<span>PHOTOGRAPHY</span></a>
          <div className="portfolio-categories" data-cursor-reveal="text">
            {PHOTO_CATEGORIES.map(item => <button type="button" key={item.id}
              className={`portfolio-category${category === item.id ? " is-selected" : ""}`}
              data-photo-category={item.id} aria-pressed={category === item.id}
              onClick={() => chooseCategory(item.id)}>{item.label}</button>)}
          </div>
          <span className="portfolio-photo-count" aria-live="polite" data-cursor-reveal="text">{String(photos.length).padStart(2, "0")} photographs</span>
        </div>
      </nav>

      <section className="portfolio-collection" id="portfolio-collection" tabIndex="-1" aria-labelledby="portfolio-collection-title">
        <div className="portfolio-collection-heading">
          <div className="portfolio-heading-content" data-cursor-reveal="text">
            <span className="portfolio-eyebrow">A collection of moments</span>
            <h2 id="portfolio-collection-title">{category === "all" ? "Selected photographs" : currentCategory.label}</h2>
          </div>
        </div>
        <div className="portfolio-gallery-inner">
          <div className="portfolio-spread-toolbar" data-cursor-reveal="text" data-cursor-key="spread-controls">
            <span>Photos in conversation.</span>
            <button type="button" onClick={event => {
              animatePhotoLayout(spreadsRef.current, () => setLayoutSeed(seed => seed + 1));
              pulseConfirmation(event.currentTarget);
            }} aria-label="Rearrange photographs">
              Rearrange <span aria-hidden="true">↻</span>
            </button>
            <span className="portfolio-spread-status" role="status">Arrangement {layoutSeed + 1}. {spreads.length} photo spreads.</span>
          </div>
          <div className="portfolio-spreads" ref={spreadsRef}>
            {spreads.map((spread, index) => <PhotoSpread key={spread.id} spread={spread} index={index} total={spreads.length}
              onSelect={(id, trigger) => { photoTriggerRef.current = trigger; setSelectedIndex(photos.findIndex(photo => photo.id === id)); }} />)}
          </div>
          <div className="portfolio-endnote"><span data-cursor-reveal="text">More moments, soon.</span><button type="button" data-cursor-reveal="text" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}>Back to top <span aria-hidden="true">↑</span></button></div>
        </div>
      </section>
    </main>
    <Footer cursorReveal />
    <RevealCursors />
    {selectedIndex !== null && <PhotoLightbox photos={photos} index={selectedIndex} triggerRef={photoTriggerRef} onChange={setSelectedIndex} onClose={() => setSelectedIndex(null)} />}
  </div>;
}
