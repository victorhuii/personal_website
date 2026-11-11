import { useEffect, useId, useState } from "react";
import { SITE } from "../content/siteContent";
import TypedTagline from "../components/TypedTagline";
import CompactNavigation from "../components/CompactNavigation";

const PAINTING_FRAME = "/intro/white-painted-studio-frame.png";
const PAINTINGS = [
  {
    src: "/intro/painted-golden-gate-essentials-v2.png",
    title: "Golden Gate, after dark",
    alt: "Victor in an ESSENTIALS / FEAR OF GOD hoodie at the Golden Gate Bridge, in four-color comic screen-print textures inside a white brush-painted studio frame",
    cropClass: "intro-artwork-image--framed-source",
  },
  {
    src: "/intro/purple-flower-ochre-sun.png",
    title: "Purple flower study",
    alt: "An open-petal purple flower with a warm ochre sun and lavender paint splashes, inside a white brush-painted wooden studio frame",
  },
];

export default function IntroPage({ leaving = false, onEnter }) {
  const [paintingIndex, setPaintingIndex] = useState(0);
  const signatureFilterId = useId();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      setPaintingIndex((index) => (index + 1) % PAINTINGS.length);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [paintingIndex]);

  function enterSite(event) {
    event.preventDefault();
    if (leaving) return;
    if (onEnter) {
      onEnter();
      return;
    }
    window.location.hash = "#/photography";
  }

  return (
    <main className={`intro-page ${leaving ? "intro-page--leaving" : ""}`}>
      <header className="intro-topline">
        <CompactNavigation page="portfolio" />
      </header>

      <div className="intro-stage" aria-label="A preview of Victor's portfolio">
        <div className="intro-painting-showcase">
          <button
            type="button"
            className="intro-artwork"
            onClick={() => setPaintingIndex((index) => (index + 1) % PAINTINGS.length)}
            aria-label={`Next painting. Currently showing ${PAINTINGS[paintingIndex].title}`}
          >
            <span className="intro-artwork-visual">
              <span className="intro-artwork-window">
              {PAINTINGS.map((painting, index) => (
                <img
                  key={painting.src}
                  src={painting.src}
                  alt={index === paintingIndex ? painting.alt : ""}
                  aria-hidden={index !== paintingIndex}
                  className={`intro-artwork-image ${painting.cropClass ?? ""}${index === paintingIndex ? " is-active" : ""}`}
                />
              ))}
              </span>
              <span className="intro-artwork-frame" style={{ borderImageSource: `url("${PAINTING_FRAME}")` }} aria-hidden="true" />
              <svg className="intro-artwork-signature" viewBox="0 0 1588 1032" aria-hidden="true" focusable="false">
                <defs>
                  <filter id={signatureFilterId} colorInterpolationFilters="sRGB">
                    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.2126 -0.7152 -0.0722 0 1" />
                  </filter>
                </defs>
                <image href="/intro/victor-mark.png" width="1588" height="1032" filter={`url(#${signatureFilterId})`} />
              </svg>
            </span>
          </button>
          <div className="intro-artwork-controls" role="group" aria-label="Painting navigation">
            <button type="button" aria-label="Previous painting"
              onClick={() => setPaintingIndex(index => (index - 1 + PAINTINGS.length) % PAINTINGS.length)}>{"<"}</button>
            <button type="button" aria-label="Next painting"
              onClick={() => setPaintingIndex(index => (index + 1) % PAINTINGS.length)}>{">"}</button>
          </div>
        </div>
      </div>

      <div className="intro-bottomline">
        <p><TypedTagline /></p>
        <a
          href={leaving ? undefined : "#/photography"}
          className="intro-enter"
          onClick={enterSite}
          aria-disabled={leaving}
        >
          {SITE.intro.enterLabel} <span aria-hidden="true">↓</span>
        </a>
      </div>
    </main>
  );
}
