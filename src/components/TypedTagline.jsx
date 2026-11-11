import { useEffect, useState } from "react";
import { SITE } from "../content/siteContent";
import "../styles/typed-tagline.css";

const WORDS = SITE.tagline.filter(Boolean);
const rolePrefix = word => word.startsWith("ML ") ? "I'm an " : "I'm a ";

export default function TypedTagline() {
  const words = WORDS;
  const [position, setPosition] = useState({ word: 0, length: 0, deleting: false });

  useEffect(() => {
    if (words.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const current = words[position.word % words.length];
    const delay = position.deleting
      ? position.length === 0 ? 350 : 55
      : position.length === current.length ? 1600 : 95;

    const timer = window.setTimeout(() => {
      setPosition(previous => {
        const word = words[previous.word % words.length];
        if (!previous.deleting && previous.length < word.length) {
          return { ...previous, length: previous.length + 1 };
        }
        if (!previous.deleting) return { ...previous, deleting: true };
        if (previous.length > 0) return { ...previous, length: previous.length - 1 };
        return { word: (previous.word + 1) % words.length, length: 0, deleting: false };
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [position, words]);

  if (words.length === 0) return null;

  const current = words[position.word % words.length];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const longestWord = Math.max(...words.map(word => word.length));

  return (
    <span className="typed-tagline" role="text" aria-label={words.map(word => `${rolePrefix(word)}${word}`).join(", ")}
      style={{ minWidth: `${longestWord + 6}ch` }}>
      <span aria-hidden="true">{rolePrefix(reducedMotion ? words[0] : current)}</span>
      <span className="typed-tagline-role" aria-hidden="true">{reducedMotion ? words[0] : current.slice(0, position.length)}</span>
      <span className="typed-tagline-cursor" aria-hidden="true" />
    </span>
  );
}
