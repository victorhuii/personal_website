import { useRef } from "react";
import { SITE } from "../content/siteContent";
import TypedTagline from "./TypedTagline";
import SlidingPillNavigation from "./SlidingPillNavigation";
import useCursorReveals from "../hooks/useCursorReveals";

export default function TopHeader({ page }) {
  const rootRef = useRef(null);
  useCursorReveals(rootRef, true, 100);
  return (
    <header className="site-heading gutter" ref={rootRef} data-cursor-root data-cursor-scope="site-header">
      <div className="site-heading-inner">
        <a className="identity-mark" href="#/" aria-label={`${SITE.name} — back to landing page`}>
          <span aria-hidden="true">v.</span>
        </a>
        <div className="identity-copy">
          <h1>{SITE.name}</h1>
          <p><TypedTagline /></p>
        </div>
        <div className="header-origin" data-cursor-reveal="text" data-cursor-key="origin">
          <span className="header-origin-flight" aria-hidden="true">
            <svg viewBox="0 0 260 35" fill="none">
              <path d="M3 32C71 -7 164 -7 262 25" />
            </svg>
            <span className="header-origin-plane">✈</span>
          </span>
          <span className="header-origin-route">
            <span className="header-origin-state">Hong Kong</span>
            <span className="header-origin-transition">
              <span>1</span>
              <svg viewBox="0 0 34 10" fill="none" aria-hidden="true"><path d="M1 5h31m-5-4 5 4-5 4" /></svg>
            </span>
            <span className="header-origin-state">Guangzhou</span>
            <span className="header-origin-transition">
              <span>6</span>
              <svg viewBox="0 0 34 10" fill="none" aria-hidden="true"><path d="M1 5h31m-5-4 5 4-5 4" /></svg>
            </span>
            <span className="header-origin-state">Bay Area</span>
          </span>
          <span className="header-origin-signature">
            <img className="header-sleeping-dog" src="/illustrations/snoopy-sleeping.png"
              width="56" height="56" alt="Snoopy sleeping on his doghouse" />
            <span className="header-origin-name" lang="zh">{SITE.about.chineseName}</span>
          </span>
        </div>
        <SlidingPillNavigation page={page} />
      </div>
      <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />
    </header>
  );
}
