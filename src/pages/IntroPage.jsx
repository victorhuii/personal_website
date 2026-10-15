import {
  useEffect,
  useState,
} from "react";

import {
  PROJECTS,
  SITE,
} from "../content/siteContent";


const INTRO_LOGO =
  "/intro/victor-mark.png";


const PAINTINGS = [
  {
    src:
      "/intro/painted-flower-cutout.png",

    title:
      "Blue flower",

    alt:
      "Blue flower painted inside a weathered screen-print frame",
  },

  {
    src:
      "/intro/painted-koi-cutout.png",

    title:
      "Koi in motion",

    alt:
      "Orange koi swimming through blue painted ripples inside the frame",
  },

  {
    src:
      "/intro/painted-mountain-cutout.png",

    title:
      "Mountain light",

    alt:
      "Blue mountain and small tree painted beneath an orange sun inside the frame",
  },
];


const STUDIO_PHOTOS = [
  {
    src:
      "/intro/studio-sketchbook.png",

    caption:
      "From the sketchbook",

    side:
      "left",
  },

  {
    src:
      "/intro/studio-print.png",

    caption:
      "In the studio",

    side:
      "right",
  },
];


function ProjectPreview({
  project,
  index,
  onEnter,
}) {
  const colors =
    project.hue ?? [
      "#f1e7dc",
      "#d9e2ef",
      "#f7d9ce",
    ];

  return (
    <button
      type="button"
      className={`intro-preview intro-preview--${
        index + 1
      }`}
      onClick={
        onEnter
      }
      aria-label={`Open main site from ${project.company}`}
    >
      <span
        className="intro-preview-image"
        style={{
          background:
            `linear-gradient(
              140deg,
              ${colors.join(
                ", "
              )}
            )`,
        }}
      >
        {project.image && (
          <img
            src={
              project.image
            }
            alt=""
          />
        )}

        {!project.image && (
          <span
            className="intro-preview-shape"
            aria-hidden="true"
          >
            ✳
          </span>
        )}
      </span>

      <span className="intro-preview-caption">
        <b>
          {
            project.company
          }
        </b>

        <small>
          {
            project.year
          }
        </small>
      </span>
    </button>
  );
}


export default function IntroPage({
  leaving = false,
  onEnter,
}) {
  const [
    paintingIndex,
    setPaintingIndex,
  ] =
    useState(0);


  /*
  Slowly cycle paintings.
  */

  useEffect(() => {
    if (
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
    ) {
      return;
    }

    const timer =
      setTimeout(
        () =>
          setPaintingIndex(
            (
              index
            ) =>
              (
                index +
                1
              ) %
              PAINTINGS.length
          ),
        6500
      );

    return () =>
      clearTimeout(
        timer
      );
  }, [
    paintingIndex,
  ]);


  function nextPainting() {
    setPaintingIndex(
      (
        index
      ) =>
        (
          index +
          1
        ) %
        PAINTINGS.length
    );
  }


  function enterSite() {
    if (
      leaving
    ) {
      return;
    }

    if (
      onEnter
    ) {
      onEnter();

      return;
    }

    window.location.hash =
      "#/about";
  }


  return (
    <main
      className={`intro-page ${
        leaving
          ? "intro-page--leaving"
          : ""
      }`}
    >

      <div className="intro-topline">
        <span>
          {
            SITE.name
          }
        </span>

        <span>
          {
            SITE.intro.eyebrow
          }{" "}
          ·{" "}
          {
            new Date().getFullYear()
          }
        </span>
      </div>


      <div
        className="intro-stage"
        aria-label="A preview of Victor's portfolio"
      >

        {PROJECTS.slice(
          0,
          4
        ).map(
          (
            project,
            index
          ) => (
            <ProjectPreview
              key={
                project.company
              }
              project={
                project
              }
              index={
                index
              }
              onEnter={
                enterSite
              }
            />
          )
        )}


        {STUDIO_PHOTOS.map(
          (
            photo
          ) => (
            <figure
              className={`intro-photo intro-photo--${photo.side}`}
              key={
                photo.src
              }
              aria-hidden="true"
            >
              <img
                src={
                  photo.src
                }
                alt=""
              />

              <figcaption>
                {
                  photo.caption
                }
              </figcaption>
            </figure>
          )
        )}


        <button
          type="button"
          className="intro-artwork"
          onClick={
            nextPainting
          }
          aria-label={`Change painting. Currently showing ${PAINTINGS[paintingIndex].title}`}
        >
          <span className="intro-artwork-visual">

            {PAINTINGS.map(
              (
                painting,
                index
              ) => (
                <img
                  key={
                    painting.src
                  }
                  src={
                    painting.src
                  }
                  alt={
                    index ===
                    paintingIndex
                      ? painting.alt
                      : ""
                  }
                  aria-hidden={
                    index !==
                    paintingIndex
                  }
                  className={`intro-artwork-image ${
                    index ===
                    paintingIndex
                      ? "is-active"
                      : ""
                  }`}
                />
              )
            )}

          </span>

          <span className="intro-artwork-label">

            <span>
              0
              {
                paintingIndex +
                1
              }{" "}
              /{" "}
              {
                PAINTINGS[
                  paintingIndex
                ].title
              }
            </span>

            <span>
              {
                SITE.intro
                  .artworkCaption
              }
            </span>

          </span>
        </button>


        <h1 className="intro-logo">
          <img
            src={
              INTRO_LOGO
            }
            alt="Victor"
          />
        </h1>

      </div>


      <div className="intro-bottomline">

        <p>
          {
            SITE.tagline[0]
          }

          <br />

          {
            SITE.tagline[1]
          }
        </p>


        <button
          type="button"
          className="intro-enter"
          onClick={
            enterSite
          }
          disabled={
            leaving
          }
        >
          {
            SITE.intro
              .enterLabel
          }{" "}

          <span aria-hidden="true">
            ↓
          </span>
        </button>


        {/*
        Finger / character creation
        link intentionally removed.
        */}

        <span className="intro-bottomnote">
          {
            SITE.intro
              .footerNote
          }
        </span>

      </div>
    </main>
  );
}