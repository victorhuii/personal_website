import {
  useEffect,
  useRef,
  useState,
} from "react";

import FloatingBackground from "../components/FloatingBackground";


const ASCII_CHARACTERS = [
  "@",
  "#",
  "%",
  "&",
  "X",
  "x",
  "+",
  "=",
  "-",
  ":",
  ".",
];


const SLIDES = [
  {
    id: "golden-gate",

    label:
      "SAN FRANCISCO / GOLDEN GATE",

    imageSrc:
      "/creation/golden-gate-silhouette.png",

    zoom: 1.02,

    horizontalBias: 0,

    verticalBias: 0,
  },

  {
    id: "tree-moon",

    label:
      "MOONLIT LAKE / REFLECTION",

    imageSrc:
      "/creation/tree-moon-silhouette.png",

    zoom: 1.01,

    horizontalBias: 0,

    verticalBias: 0,
  },

  {
    id: "moon-gate",

    label:
      "MOON GATE / SPIRIT LANDSCAPE",

    imageSrc:
      "/creation/moon-gate-silhouette.png",

    zoom: 1.01,

    horizontalBias: 0,

    verticalBias: 0,
  },
];


function LandingAsciiCanvas({
  slide,
  intensity,
  dark,
}) {
  const canvasRef =
    useRef(null);

  const intensityRef =
    useRef(intensity);

  const darkRef =
    useRef(dark);


  useEffect(() => {
    intensityRef.current =
      intensity;

    canvasRef.current?.dispatchEvent(
      new Event(
        "landing-redraw"
      )
    );
  }, [intensity]);


  useEffect(() => {
    darkRef.current =
      dark;

    canvasRef.current?.dispatchEvent(
      new Event(
        "landing-redraw"
      )
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

    let width = 0;
    let height = 0;

    let frame = 0;

    let previousTime = 0;
    let lastDraw = 0;

    let ready = false;


    function rebuild() {
      if (!ready) {
        return;
      }


      const bounds =
        canvas.getBoundingClientRect();


      width =
        bounds.width;

      height =
        bounds.height;


      if (
        !width ||
        !height
      ) {
        return;
      }


      const dpr =
        Math.min(
          window.devicePixelRatio ||
            1,

          1.4
        );


      canvas.width =
        Math.round(
          width *
            dpr
        );


      canvas.height =
        Math.round(
          height *
            dpr
        );


      context.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );


      const spacing =
        width < 700
          ? 7
          : 7.4;


      const columns =
        Math.ceil(
          width /
            spacing
        );


      const rows =
        Math.ceil(
          height /
            spacing
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
        "#ffffff";


      sampleContext.fillRect(
        0,
        0,
        columns,
        rows
      );


      const sourceWidth =
        image.naturalWidth ||
        1;


      const sourceHeight =
        image.naturalHeight ||
        1;


      const coverScale =
        Math.max(
          columns /
            sourceWidth,

          rows /
            sourceHeight
        ) *
        slide.zoom;


      const drawWidth =
        sourceWidth *
        coverScale;


      const drawHeight =
        sourceHeight *
        coverScale;


      const drawX =
        (
          columns -
          drawWidth
        ) /
          2 +
        columns *
          slide.horizontalBias;


      const drawY =
        (
          rows -
          drawHeight
        ) /
          2 +
        rows *
          slide.verticalBias;


      sampleContext.drawImage(
        image,
        drawX,
        drawY,
        drawWidth,
        drawHeight
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
        row++
      ) {
        for (
          let column = 0;
          column < columns;
          column++
        ) {
          const pixelIndex =
            (
              row *
                columns +
              column
            ) *
            4;


          const luminance =
            pixels[
              pixelIndex
            ] *
              0.2126 +
            pixels[
              pixelIndex + 1
            ] *
              0.7152 +
            pixels[
              pixelIndex + 2
            ] *
              0.0722;


          let darkness =
            (
              255 -
              luminance
            ) /
            255;


          darkness =
            Math.pow(
              darkness,
              0.72
            );


          if (
            darkness <
            0.07
          ) {
            continue;
          }


          const levels =
            10;


          darkness =
            Math.round(
              darkness *
                levels
            ) /
            levels;


          const charIndex =
            Math.min(
              ASCII_CHARACTERS.length -
                1,

              Math.max(
                0,

                Math.floor(
                  (
                    1 -
                    darkness
                  ) *
                    ASCII_CHARACTERS.length
                )
              )
            );


          const x =
            (
              column +
              0.5
            ) *
            (
              width /
              columns
            );


          const y =
            (
              row +
              0.5
            ) *
            (
              height /
              rows
            );


          particles.push({
            homeX: x,
            homeY: y,

            x,
            y,

            vx: 0,
            vy: 0,

            darkness,

            character:
              ASCII_CHARACTERS[
                charIndex
              ],

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


      draw(
        0,
        1
      );
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
        `${
          width < 700
            ? 10
            : 11.5
        }px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;


      context.textAlign =
        "center";


      context.textBaseline =
        "middle";


      const ink =
        darkRef.current
          ? "255,255,255"
          : "28,28,27";


      const strength =
        (
          intensityRef.current /
          100
        ) *
        0.75;


      for (
        const particle of
        particles
      ) {

        if (
          !reducedMotion
        ) {
          const driftX =
            Math.sin(
              time *
                0.00062 +
                particle.phase
            ) *
            1.25;


          const driftY =
            Math.cos(
              time *
                0.0005 +
                particle.phase *
                  0.72
            ) *
            1.05;


          const dx =
            particle.x -
            pointer.x;


          const dy =
            particle.y -
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
            2;


          particle.vx +=
            (
              (
                particle.homeX +
                driftX -
                particle.x
              ) *
                0.058 +
              dx /
                distance *
                push
            ) *
            delta;


          particle.vy +=
            (
              (
                particle.homeY +
                driftY -
                particle.y
              ) *
                0.058 +
              dy /
                distance *
                push
            ) *
            delta;


          particle.vx *=
            Math.pow(
              0.82,
              delta
            );


          particle.vy *=
            Math.pow(
              0.82,
              delta
            );


          particle.x +=
            particle.vx *
            delta;


          particle.y +=
            particle.vy *
            delta;
        }


        const alpha =
          (
            0.18 +
            particle.darkness *
              0.75
          ) *
          strength;


        context.fillStyle =
          `rgba(
            ${ink},
            ${alpha}
          )`;


        context.fillText(
          particle.character,
          particle.x,
          particle.y
        );
      }
    }


    function animate(time) {
      frame =
        requestAnimationFrame(
          animate
        );


      if (
        time -
          lastDraw <
        30
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
      pointer.x =
        -1000;

      pointer.y =
        -1000;
    }


    function redraw() {
      if (!ready) {
        return;
      }


      draw(
        performance.now(),
        1
      );
    }


    image.onload =
      () => {
        ready =
          true;


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
      slide.imageSrc;


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
      "landing-redraw",
      redraw
    );


    return () => {
      image.onload =
        null;


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
        "landing-redraw",
        redraw
      );
    };
  }, [
    slide,
  ]);


  return (
    <canvas
      ref={canvasRef}
      className="creation-ascii landing-ascii"
      aria-hidden="true"
    />
  );
}



export default function LandingPage() {
  const [
    slideIndex,
    setSlideIndex,
  ] =
    useState(0);


  const [
    intensity,
    setIntensity,
  ] =
    useState(50);


  const [
    dark,
    setDark,
  ] =
    useState(false);


  const slide =
    SLIDES[
      slideIndex
    ];


  function nextSlide() {
    setSlideIndex(
      (current) =>
        (
          current +
          1
        ) %
        SLIDES.length
    );
  }


  return (
    <main className="landing-root">

      <div className="landing-hero">


        <header className="landing-topbar">

          <a
            href="#/"
            className="landing-mark"
            aria-label="Victor — home"
          >
            v.
          </a>


          <nav
            className="landing-nav"
            aria-label="Main navigation"
          >

            <a href="#/work">
              WORK
            </a>


            <a href="#/portfolio">
              PORTFOLIO
            </a>

          </nav>

        </header>


        <section
          className={`creation-frame landing-frame ${
            dark
              ? "landing-frame--dark"
              : ""
          }`}

          aria-label={`${slide.label} ASCII landscape`}
        >


          <FloatingBackground
            dark={dark}
            contained
          />


          <LandingAsciiCanvas
            slide={slide}
            intensity={
              intensity
            }
            dark={dark}
          />


          <span className="landing-scene-label">
            {
              slide.label
            }
          </span>


          <div className="creation-tools landing-tools">

            <button
              type="button"

              onClick={() =>
                setDark(
                  (current) =>
                    !current
                )
              }

              aria-label={
                dark
                  ? "Switch canvas to light mode"
                  : "Switch canvas to night mode"
              }

              title={
                dark
                  ? "Light canvas"
                  : "Night canvas"
              }
            >
              {dark
                ? "☾"
                : "☼"}
            </button>


            <input
              aria-label="ASCII opacity"

              type="range"

              min="0"

              max="100"

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


          <div className="landing-copy">

            <h1>
              VICTOR
            </h1>


            <p className="landing-roles">
              software engineer,
              web developer,
              data analyst.
            </p>


            <p className="landing-description">
              new grad from
              berkeley, passionate
              for data science, the
              cross section between
              creative and technical
              skills.
            </p>

          </div>


          <button
            type="button"

            className="landing-next"

            onClick={
              nextSlide
            }

            aria-label={`Show next scene after ${slide.label}`}

            title="Next scene"
          >
            →
          </button>


          {/*
          ENTER SITE IS NOW INSIDE
          THE CANVAS.

          Nothing else moves.
          */}

          <a
            className="landing-enter-site landing-enter-site--canvas"
            href="#/about"
          >
            ENTER SITE
          </a>

        </section>


        {/*
        KEEP THE OLD SPACE RESERVED.

        This preserves the exact same
        canvas dimensions and overall
        page dimensions you already had.

        It contains nothing now.
        */}

        <div
          className="landing-enter-spacer"
          aria-hidden="true"
        />

      </div>

    </main>
  );
}