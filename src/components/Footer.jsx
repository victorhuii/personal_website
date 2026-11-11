import {
  useEffect,
  useState,
} from "react";

import {
  SITE,
  TOP_PAGES,
} from "../content/siteContent";


const FOOTER_NAV = TOP_PAGES.map(label => ({ label: label === "Portfolio" ? "PHOTOGRAPHY" : label.toUpperCase(), href: `#/${label.toLowerCase()}` }));


const SAN_FRANCISCO_TIME = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const SAN_FRANCISCO_HOUR = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  hour: "numeric",
  hourCycle: "h23",
});

function Clock({ cursorReveal }) {
  const [
    now,
    setNow,
  ] =
    useState(
      new Date()
    );

  useEffect(() => {
    const timer =
      setInterval(
        () =>
          setNow(
            new Date()
          ),
        1000
      );

    return () =>
      clearInterval(
        timer
      );
  }, []);

  const hour = Number(SAN_FRANCISCO_HOUR.format(now));
  const night = hour < 6 || hour >= 18;

  return (
    <div className="footer-local-time" data-cursor-reveal={cursorReveal ? "text" : undefined}>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {night ? <path d="M16.8 12.5A7.2 7.2 0 0 1 7.5 3.2a7.2 7.2 0 1 0 9.3 9.3Z" fill="currentColor" /> : <>
          <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 1.5v2m0 13v2m8.5-8.5h-2m-13 0h-2m14.5-6-1.5 1.5m-9 9L4 16m12 0-1.5-1.5m-9-9L4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </>}
      </svg>
      <span><time dateTime={now.toISOString()}>{SAN_FRANCISCO_TIME.format(now)}</time>{" "}<span className="footer-location">San Francisco, CA</span></span>
    </div>
  );
}


export default function Footer({ cursorReveal = false }) {
  return (
    <footer className="footer gutter">
      <div className="container">

        <div className="footer-top">

          <div>
            <div className="footer-brand" data-cursor-reveal={cursorReveal ? "text" : undefined}>
              <a className="footer-mark" href="#/" aria-label={`${SITE.name} — home`}><span aria-hidden="true">v.</span></a>
              <span className="footer-name">{SITE.name}</span>
            </div>

            <Clock cursorReveal={cursorReveal} />
            <a className="footer-email" href={`mailto:${SITE.email}`} data-cursor-reveal={cursorReveal ? "text" : undefined}>{SITE.email}</a>
          </div>

          <div className="footer-links" data-cursor-reveal={cursorReveal ? "text" : undefined}>
            {FOOTER_NAV.map(
              ({
                label,
                href,
              }) => (
                <a
                  key={
                    label
                  }
                  href={
                    href
                  }
                >
                  {
                    label
                  }
                </a>
              )
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span data-cursor-reveal={cursorReveal ? "text" : undefined}>
            Built with React ♡
          </span>

        </div>
      </div>
    </footer>
  );
}
