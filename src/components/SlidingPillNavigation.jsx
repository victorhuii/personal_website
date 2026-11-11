import { useLayoutEffect, useRef } from "react";
import { TOP_PAGES } from "../content/siteContent";
import { motionSettings } from "../utils/motion";
import "../styles/sliding-pill-navigation.css";

export default function SlidingPillNavigation({ page }) {
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const moveRef = useRef(() => {});

  useLayoutEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animation;
    let positioned = false;
    let disposed = false;

    const position = (animate = false) => {
      const selected = nav.querySelector('a[aria-current="page"]');
      if (!selected) { animation?.cancel(); delete nav.dataset.pillReady; positioned = false; return; }

      // Capture the visible position before cancelling a move so rapid clicks
      // continue from the middle of the slide rather than the previous endpoint.
      const navBounds = nav.getBoundingClientRect();
      const pillBounds = pill.getBoundingClientRect();
      const from = {
        x: pillBounds.left - navBounds.left + nav.scrollLeft,
        y: pillBounds.top - navBounds.top + nav.scrollTop,
        width: pillBounds.width, height: pillBounds.height,
      };
      const to = {
        x: selected.offsetLeft, y: selected.offsetTop,
        width: selected.offsetWidth, height: selected.offsetHeight,
      };
      animation?.cancel();
      Object.assign(pill.style, {
        transform: `translate(${to.x}px, ${to.y}px)`,
        width: `${to.width}px`, height: `${to.height}px`,
      });
      nav.dataset.pillReady = "true";
      const distance = Math.hypot(to.x - from.x, to.y - from.y);
      if (positioned && animate && !media.matches && distance > .5) {
        const stretch = Math.min(18, distance * .13);
        const frames = Array.from({ length: 9 }, (_, index) => {
          const progress = index / 8;
          const swell = Math.sin(progress * Math.PI);
          const width = from.width + (to.width - from.width) * progress + swell * stretch;
          const height = from.height + (to.height - from.height) * progress - swell * 1.2;
          const centerX = from.x + from.width / 2 + (to.x + to.width / 2 - from.x - from.width / 2) * progress;
          const centerY = from.y + from.height / 2 + (to.y + to.height / 2 - from.y - from.height / 2) * progress;
          return {
            transform: `translate(${centerX - width / 2}px, ${centerY - height / 2}px)`,
            width: `${width}px`, height: `${height}px`, offset: progress,
          };
        });
        const timing = motionSettings();
        animation = pill.animate(frames, { duration: timing.move, easing: timing.inOut });
      }
      positioned = true;
    };

    moveRef.current = position;
    position();
    const resize = new ResizeObserver(() => position());
    resize.observe(nav);
    nav.querySelectorAll("a").forEach(link => resize.observe(link));
    const preferenceChanged = () => position();
    media.addEventListener("change", preferenceChanged);
    document.fonts.ready.then(() => { if (!disposed) position(); });

    return () => {
      disposed = true;
      resize.disconnect();
      media.removeEventListener("change", preferenceChanged);
      animation?.cancel();
      moveRef.current = () => {};
    };
  }, []);

  useLayoutEffect(() => { moveRef.current(true); }, [page]);

  return <nav ref={navRef} className="top-links top-links--sliding" aria-label="Main navigation"
    data-cursor-reveal="text" data-cursor-key="main-navigation">
    <span ref={pillRef} className="navigation-sliding-pill" aria-hidden="true" />
    {TOP_PAGES.map(label => {
      const route = label.toLowerCase();
      return <a key={route} href={`#/${route}`} className={page === route ? "active" : ""}
        aria-current={page === route ? "page" : undefined}>{label === "Portfolio" ? "Photography" : label}</a>;
    })}
  </nav>;
}
