import { useEffect, useRef, useState } from "react";
import { SITE } from "../content/siteContent";

const HAND_IMAGE = "/creation/reaching-hands.png";
const CHARACTERS = ["@", "#", "x", "+", ":", "."];

/*
=====================================
GOOGLY EYE CURSOR
=====================================

Outer circle:
- follows actual mouse immediately

Inner dot:
- moves opposite mouse direction
- has inertia
- hits edge
- bounces
- springs back to center
*/
function GooglyCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;

    if (!cursor || !dot) return;

    if (
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    const page = cursor.closest(".creation-page");

    if (!page) return;

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    let mouseX = -100;
    let mouseY = -100;

    let lastMouseX = 0;
    let lastMouseY = 0;

    let started = false;

    let dotX = 0;
    let dotY = 0;

    let velocityX = 0;
    let velocityY = 0;

    let frame = 0;

    const SIZE = 34;
    const HALF = SIZE / 2;

    /*
    More exaggerated googly physics
    */
    const IMPULSE = 0.34;
    const SPRING = 0.082;
    const DAMPING = 0.835;

    /*
    Inner circle center is 21,21.

    Outer circle radius is 19.

    Pupil radius is 2.7.

    So ~14 px movement leaves
    a little breathing room.
    */
    const MAX_OFFSET = 10.5;
    const EDGE_BOUNCE = 1.58;

    const clamp = (value, min, max) =>
      Math.max(min, Math.min(max, value));

    function moveOuterCursor() {
      cursor.style.transform = `translate3d(
        ${mouseX - HALF}px,
        ${mouseY - HALF}px,
        0
      )`;
    }

    function handleMove(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      cursor.style.opacity = "1";

      moveOuterCursor();

      if (!started) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;

        started = true;

        return;
      }

      const dx = clamp(
        mouseX - lastMouseX,
        -60,
        60
      );

      const dy = clamp(
        mouseY - lastMouseY,
        -60,
        60
      );

      lastMouseX = mouseX;
      lastMouseY = mouseY;

      if (reducedMotion) return;

      /*
      Opposite-direction inertia.

      Mouse up -> pupil goes down.
      Mouse right -> pupil goes left.
      */
      velocityX -= dx * IMPULSE;
      velocityY -= dy * IMPULSE;

      velocityX = clamp(
        velocityX,
        -22,
        22
      );

      velocityY = clamp(
        velocityY,
        -22,
        22
      );
    }

    function handleEnter(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;

      lastMouseX = mouseX;
      lastMouseY = mouseY;

      started = true;

      moveOuterCursor();

      cursor.style.opacity = "1";
    }

    function handleLeave() {
      cursor.style.opacity = "0";

      started = false;
    }

    function animate() {
      if (!reducedMotion) {
        /*
        Pull pupil back to center.
        */
        velocityX += -dotX * SPRING;
        velocityY += -dotY * SPRING;

        /*
        Friction.
        */
        velocityX *= DAMPING;
        velocityY *= DAMPING;

        dotX += velocityX;
        dotY += velocityY;

        /*
        Collision with inside edge.
        */
        const distance =
          Math.hypot(dotX, dotY);

        if (distance > MAX_OFFSET) {
          const normalX =
            dotX / distance;

          const normalY =
            dotY / distance;

          dotX =
            normalX * MAX_OFFSET;

          dotY =
            normalY * MAX_OFFSET;

          const outwardSpeed =
            velocityX * normalX +
            velocityY * normalY;

          if (outwardSpeed > 0) {
            velocityX -=
              normalX *
              outwardSpeed *
              EDGE_BOUNCE;

            velocityY -=
              normalY *
              outwardSpeed *
              EDGE_BOUNCE;
          }
        }

        /*
        SVG circles use cx/cy,
        so we're moving the pupil
        with a transform inside the SVG.
        */
        dot.setAttribute(
          "transform",
          `translate(${dotX} ${dotY})`
        );
      }

      frame =
        requestAnimationFrame(animate);
    }

    page.addEventListener(
      "pointermove",
      handleMove
    );

    page.addEventListener(
      "pointerenter",
      handleEnter
    );

    page.addEventListener(
      "pointerleave",
      handleLeave
    );

    frame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);

      page.removeEventListener(
        "pointermove",
        handleMove
      );

      page.removeEventListener(
        "pointerenter",
        handleEnter
      );

      page.removeEventListener(
        "pointerleave",
        handleLeave
      );
    };
  }, []);

  return (
    <svg
      ref={cursorRef}
      className="creation-googly-cursor"
      viewBox="0 0 34 34"
      width="34"
      height="34"
      aria-hidden="true"
    >
      <circle
        className="creation-googly-cursor-ring"
        cx="17"
        cy="17"
        r="15.5"
      />

      <circle
        ref={dotRef}
        className="creation-googly-cursor-dot"
        cx="17"
        cy="17"
        r="2.3"
      />
    </svg>
  );
}

/*
=====================================
ASCII HAND DRAWING
=====================================
*/

function AsciiHands({
  intensity,
  dark,
}) {
  const canvasRef = useRef(null);

  const intensityRef =
    useRef(intensity);

  const darkRef =
    useRef(dark);

  useEffect(() => {
    intensityRef.current =
      intensity;

    canvasRef.current?.dispatchEvent(
      new Event("creation-redraw")
    );
  }, [intensity]);

  useEffect(() => {
    darkRef.current = dark;

    canvasRef.current?.dispatchEvent(
      new Event("creation-redraw")
    );
  }, [dark]);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext(
        "2d",
        {
          alpha: true,
        }
      );

    const image =
      new Image();

    const pointer = {
      x: -1000,
      y: -1000,
    };

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    let particles = [];
    let dust = [];

    let frame = 0;

    let width = 0;
    let height = 0;

    let previousTime = 0;
    let lastDraw = 0;

    let ready = false;

    function rebuild() {
      if (!ready) return;

      const bounds =
        canvas.getBoundingClientRect();

      width = bounds.width;
      height = bounds.height;

      if (!width || !height) {
        return;
      }

      const dpr =
        Math.min(
          window.devicePixelRatio ||
          1,
          2
        );

      canvas.width =
        Math.round(width * dpr);

      canvas.height =
        Math.round(height * dpr);

      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      const spacing =
        width < 680
          ? 9
          : 10;

      const columns =
        Math.ceil(
          width / spacing
        );

      const rows =
        Math.ceil(
          height / spacing
        );

      const sample =
        document.createElement(
          "canvas"
        );

      sample.width =
        columns;

      sample.height =
        rows;

      const sampleContext =
        sample.getContext(
          "2d",
          {
            willReadFrequently:
              true,
          }
        );

      sampleContext.fillStyle =
        "white";

      sampleContext.fillRect(
        0,
        0,
        columns,
        rows
      );

      sampleContext.drawImage(
        image,
        0,
        0,
        columns,
        rows
      );

      const pixels =
        sampleContext.getImageData(
          0,
          0,
          columns,
          rows
        ).data;

      particles = [];

      for (
        let row = 0;
        row < rows;
        row += 1
      ) {
        for (
          let column = 0;
          column < columns;
          column += 1
        ) {
          const index =
            (row *
              columns +
              column) *
            4;

          const shade =
            (
              pixels[index] +
              pixels[
              index + 1
              ] +
              pixels[
              index + 2
              ]
            ) /
            3;

          const darkness =
            (255 - shade) /
            255;

          if (
            darkness < 0.09
          ) {
            continue;
          }

          const character =
            CHARACTERS[
            Math.min(
              CHARACTERS.length -
              1,

              Math.floor(
                (1 -
                  darkness) *
                CHARACTERS.length
              )
            )
            ];

          const x =
            (column + 0.5) *
            width /
            columns;

          const y =
            (row + 0.5) *
            height /
            rows;

          particles.push({
            homeX: x,
            homeY: y,

            x,
            y,

            vx: 0,
            vy: 0,

            darkness,

            character,

            phase:
              Math.sin(
                column *
                12.9898 +
                row *
                78.233
              ) *
              43758.5453,
          });
        }
      }

      dust =
        Array.from(
          {
            length:
              Math.min(
                140,

                Math.round(
                  width *
                  height /
                  6500
                )
              ),
          },

          (_, i) => ({
            x:
              (i *
                173.31 +
                39) %
              width,

            y:
              (i *
                257.77 +
                71) %
              height,

            phase:
              i * 2.399,
          })
        );

      draw(0, 1);
    }

    function draw(
      time,
      delta
    ) {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      context.font =
        `${width < 680
          ? 10
          : 11
        }px ui-monospace, SFMono-Regular, Menlo, monospace`;

      context.textAlign =
        "center";

      context.textBaseline =
        "middle";

      const ink =
        darkRef.current
          ? "243, 240, 232"
          : "37, 36, 34";

      const strength =
        intensityRef.current /
        100;

      for (
        const p of
        particles
      ) {
        if (
          !reducedMotion
        ) {
          const driftX =
            Math.sin(
              time *
              0.00065 +
              p.phase
            ) *
            1.6;

          const driftY =
            Math.cos(
              time *
              0.00052 +
              p.phase *
              0.7
            ) *
            1.4;

          const dx =
            p.x -
            pointer.x;

          const dy =
            p.y -
            pointer.y;

          const distance =
            Math.hypot(
              dx,
              dy
            ) || 1;

          const push =
            Math.max(
              0,
              1 -
              distance /
              105
            ) *
            1.9;

          p.vx +=
            (
              (
                p.homeX +
                driftX -
                p.x
              ) *
              0.055 +
              dx /
              distance *
              push
            ) *
            delta;

          p.vy +=
            (
              (
                p.homeY +
                driftY -
                p.y
              ) *
              0.055 +
              dy /
              distance *
              push
            ) *
            delta;

          p.vx *=
            Math.pow(
              0.82,
              delta
            );

          p.vy *=
            Math.pow(
              0.82,
              delta
            );

          p.x +=
            p.vx *
            delta;

          p.y +=
            p.vy *
            delta;
        }

        context.fillStyle =
          `rgba(
            ${ink},
            ${Math.min(
            0.72,

            (
              0.12 +
              p.darkness *
              0.48
            ) *
            strength
          )
          }
          )`;

        context.fillText(
          p.character,
          p.x,
          p.y
        );
      }

      context.fillStyle =
        `rgba(
          ${ink},
          ${darkRef.current
          ? 0.2
          : 0.13
        }
        )`;

      for (
        const speck of
        dust
      ) {
        const x =
          speck.x +
          (
            reducedMotion
              ? 0
              : Math.sin(
                time *
                0.00035 +
                speck.phase
              ) *
              5
          );

        const y =
          speck.y +
          (
            reducedMotion
              ? 0
              : Math.cos(
                time *
                0.0004 +
                speck.phase
              ) *
              6
          );

        context.fillText(
          "·",
          x,
          y
        );
      }
    }

    function animate(time) {
      frame =
        requestAnimationFrame(
          animate
        );

      /*
      Canvas drawing runs at
      ~30fps to keep it light.
      */
      if (
        time -
        lastDraw <
        32
      ) {
        return;
      }

      const delta =
        Math.min(
          2,

          (
            time -
            (
              previousTime ||
              time
            )
          ) /
          16.67 ||
          1
        );

      previousTime =
        time;

      lastDraw =
        time;

      draw(
        time,
        delta
      );
    }

    function move(event) {
      const bounds =
        canvas.getBoundingClientRect();

      pointer.x =
        event.clientX -
        bounds.left;

      pointer.y =
        event.clientY -
        bounds.top;
    }

    function leave() {
      pointer.x = -1000;
      pointer.y = -1000;
    }

    function redraw() {
      if (
        reducedMotion &&
        ready
      ) {
        draw(0, 1);
      }
    }

    image.onload = () => {
      ready = true;

      rebuild();

      if (
        !reducedMotion
      ) {
        frame =
          requestAnimationFrame(
            animate
          );
      }
    };

    image.src =
      HAND_IMAGE;

    const observer =
      new ResizeObserver(
        rebuild
      );

    observer.observe(
      canvas
    );

    canvas.addEventListener(
      "pointermove",
      move
    );

    canvas.addEventListener(
      "pointerleave",
      leave
    );

    canvas.addEventListener(
      "creation-redraw",
      redraw
    );

    return () => {
      image.onload = null;

      observer.disconnect();

      cancelAnimationFrame(
        frame
      );

      canvas.removeEventListener(
        "pointermove",
        move
      );

      canvas.removeEventListener(
        "pointerleave",
        leave
      );

      canvas.removeEventListener(
        "creation-redraw",
        redraw
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="creation-ascii"
      aria-hidden="true"
    />
  );
}

export default function CreationPage() {
  const [
    intensity,
    setIntensity,
  ] = useState(90);

  const [
    dark,
    setDark,
  ] = useState(false);

  return (
    <main
      className={`creation-page ${dark
          ? "creation-page--dark"
          : ""
        }`}
    >
      <GooglyCursor />

      <header className="creation-header">
        <a
          href="#/intro"
          className="creation-emblem"
          aria-label="Victor — return to intro"
        >
          v.
        </a>

        <nav aria-label="Experiment navigation">
          <a href="#/intro">
            INTRO
          </a>

          <a href="#/about">
            ABOUT
          </a>

          <a href="#/work">
            WORK
          </a>

          <a href="#/creation-2">
            STUDY 02
          </a>
        </nav>
      </header>

      <section
        className="creation-frame"
        aria-label="Interactive character drawing of two reaching hands"
      >
        <AsciiHands
          intensity={
            intensity
          }
          dark={dark}
        />

        <span className="creation-frame-label">
          création / 001
        </span>

        <div className="creation-tools">
          <button
            type="button"
            onClick={() =>
              setDark(
                (value) =>
                  !value
              )
            }
            aria-label={
              dark
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
            title="Toggle theme"
          >
            {dark
              ? "☾"
              : "☼"}
          </button>

          <input
            aria-label="Drawing intensity"
            type="range"
            min="35"
            max="140"
            value={
              intensity
            }
            onChange={(
              event
            ) =>
              setIntensity(
                Number(
                  event
                    .target
                    .value
                )
              )
            }
          />
        </div>

        <div className="creation-intro">
          <p className="creation-kicker">
            AN INTERACTIVE STUDY
            IN CREATION
          </p>

          <h1>
            VICTOR
            <span
              className="creation-cursor"
              aria-hidden="true"
            >
              .
            </span>
          </h1>

          <p className="creation-subtitle">
            {
              SITE
                .tagline[0]
            }{" "}
            {
              SITE
                .tagline[1]
            }
          </p>

          <p className="creation-description">
            {
              SITE.about
                .paragraphs[0]
            }
          </p>

          <a
            href="#/about"
            className="creation-enter"
          >
            Explore my work{" "}
            <span aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <span
          className="creation-coordinate"
          aria-hidden="true"
        >
          MOVE YOUR CURSOR TO
          DISTURB THE IMAGE
        </span>
      </section>

      <footer className="creation-footer">
        <span>
          Letters, light, and a
          little bit of motion.
        </span>

        <a href="#/intro">
          Back to the original
          intro ↗
        </a>
      </footer>
    </main>
  );
}