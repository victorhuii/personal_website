import { useEffect, useState } from "react";
import "../styles/about-details.css";

// Change this to update both the visible hint and accessible button label.
const CAT_NAME = "Luna";

// Fill in your real destinations. Unconfigured labels remain plain text.
// For a local PDF, put resume.pdf in public/ and use "/resume.pdf".
const RECRUITER_LINKS = [
  { label: "Resume", href: "" },
  { label: "GitHub", href: "" },
  { label: "LinkedIn", href: "" },
];

export function PhotoGreeting() {
  return (
    <div className="photo-greeting">
      <span>nice to<br />meet you!</span>
      <svg viewBox="0 0 110 72" fill="none" aria-hidden="true">
        <path d="M9 58C35 63 24 25 58 28c18 2 31 0 41-16M88 15l12-4-1 13" />
      </svg>
    </div>
  );
}

export function AboutCat() {
  const [pets, setPets] = useState(0);
  const [purring, setPurring] = useState(false);

  useEffect(() => {
    if (!pets) return;
    const timer = window.setTimeout(() => setPurring(false), 1400);
    return () => window.clearTimeout(timer);
  }, [pets]);

  const pet = () => {
    setPurring(true);
    setPets(count => count + 1);
  };

  return (
    <div className={`about-cat${purring ? " is-purring" : ""}`}>
      <span className="about-cat-response" aria-live="polite" aria-atomic="true">
        {purring ? "purr…" : ""}
      </span>
      <button type="button" className="about-cat-button" onClick={pet}
        aria-label={`Pet ${CAT_NAME}`}>
        <svg viewBox="0 0 180 108" fill="none" aria-hidden="true">
          <g key={pets} className={purring ? "cat-pet-motion" : undefined}>
            <g className="cat-tail">
              <path d="M126 67c24 1 40-22 29-33-8-9-20-3-14 9" className="cat-tail-outline" />
              <path d="M126 67c24 1 40-22 29-33-8-9-20-3-14 9" className="cat-tail-fill" />
            </g>
            <path className="cat-fur" d="M62 59c6-19 42-26 60-12 12 9 18 33 1 36H60Z" />
            <path className="cat-soft-patch" d="M79 66c4-13 22-19 32-10 8 6 9 20 0 23H80Z" />
            <path className="cat-fur" d="M29 48 29 26q0-6 5-3l15 11q10-4 20 0l13-11q5-3 5 3l-2 22c7 21-4 34-24 35H48C27 82 19 67 29 48Z" />
            <path className="cat-ear" d="m34 32 1 13 9-6Zm46 0-8 7 8 5Z" />
            <ellipse className="cat-soft-patch" cx="57" cy="68" rx="14" ry="10" />
            <path className="cat-tabby-lines" d="m49 37 1 6m7-8v7m8-5-1 6" />
            {purring ? <path className="cat-line" d="M38 57q5-6 10 0m17 0q5-6 10 0" /> : <g className="cat-eyes">
              <ellipse cx="43" cy="56" rx="3.5" ry="4.5" />
              <ellipse cx="70" cy="56" rx="3.5" ry="4.5" />
              <circle className="cat-eye-shine" cx="42" cy="54.5" r="1.1" />
              <circle className="cat-eye-shine" cx="69" cy="54.5" r="1.1" />
            </g>}
            <path className="cat-nose" d="m52 63 5 4 5-4Z" />
            <path className="cat-line" d="M57 67v3m0 0q-4 4-7 0m7 0q4 4 7 0M23 59l10 2m-11 5 11-1m48-4 10-2m-10 6 11 1" />
            <path className="cat-fur" d="M48 77c-11-1-17 9-5 10h19c7 0 8-7 1-9m31 0c-10-1-14 9-4 9h28c10 0 10-9 1-9" />
            <path className="cat-line" d="M48 81v4m8-4v4m43-4v4m8-4v4" />
          </g>
          {purring && <g key={`purr-${pets}`} className="cat-purr-lines">
            <path d="m89 27-2-7m9 5 1-8m7 10 4-6" />
          </g>}
        </svg>
      </button>
      <span className="about-cat-hint">pet {CAT_NAME}</span>
    </div>
  );
}

export function AboutExtras() {
  return (
    <div className="about-extras">
      <nav className="recruiter-links" aria-label="Professional profiles and resume">
        {RECRUITER_LINKS.map(({ label, href }, index) => (
          <span className="recruiter-link-item" key={label}>
            {index > 0 && <span className="recruiter-link-separator" aria-hidden="true">·</span>}
            {href ? <a href={href} target="_blank" rel="noopener noreferrer"
              aria-label={`${label} (opens in a new tab)`}>{label}</a> : <span>{label}</span>}
          </span>
        ))}
      </nav>
      <AboutCat />
    </div>
  );
}
