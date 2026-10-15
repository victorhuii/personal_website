import {
  useEffect,
  useRef,
  useState,
} from "react";

const CHARACTERS = [
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

function AsciiImageField({
  imageSrc,
  intensity,
  dark,
  zoom = 1,
  verticalBias = 0,
  horizontalBias = 0,
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
        "creation-redraw"
      )
    );
  }, [intensity]);

  useEffect(() => {
    darkRef.current = dark;

    canvasRef.current?.dispatchEvent(
      new Event(
        "creation-redraw"
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
          1.5
        );

      canvas.width =
        Math.round(
          width * dpr
        );

      canvas.height =
        Math.round(
          height * dpr
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
        "#ffffff";

      sampleContext.fillRect(
        0,
        0,
        columns,
        rows
      );

      const imageWidth =
        image.naturalWidth ||
        1;

      const imageHeight =
        image.naturalHeight ||
        1;

      const coverScale =
        Math.max(
          columns /
            imageWidth,

          rows /
            imageHeight
        ) * zoom;

      const drawWidth =
        imageWidth *
        coverScale;

      const drawHeight =
        imageHeight *
        coverScale;

      const drawX =
        (
          columns -
          drawWidth
        ) /
          2 +
        columns *
          horizontalBias;

      const drawY =
        (
          rows -
          drawHeight
        ) /
          2 +
        rows *
          verticalBias;

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
          const index =
            (
              row *
                columns +
              column
            ) *
            4;

          const luminance =
            pixels[index] *
              0.2126 +
            pixels[
              index + 1
            ] *
              0.7152 +
            pixels[
              index + 2
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
              0.78
            );

          if (
            darkness <
            0.095
          ) {
            continue;
          }

          const levels =
            9;

          darkness =
            Math.round(
              darkness *
                levels
            ) /
            levels;

          const characterIndex =
            Math.min(
              CHARACTERS.length -
                1,

              Math.max(
                0,

                Math.floor(
                  (
                    1 -
                    darkness
                  ) *
                    CHARACTERS.length
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
              CHARACTERS[
                characterIndex
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

      dust =
        Array.from(
          {
            length:
              Math.min(
                115,

                Math.round(
                  width *
                    height /
                    8500
                )
              ),
          },

          (_, i) => ({
            x:
              (
                i *
                  173.31 +
                39
              ) %
              width,

            y:
              (
                i *
                  257.77 +
                71
              ) %
              height,

            phase:
              i *
              2.399,
          })
        );

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
            : 11.7
        }px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      context.textAlign =
        "center";

      context.textBaseline =
        "middle";

      const ink =
        darkRef.current
          ? "243,240,232"
          : "28,28,27";

      /*
      =================================
      OPACITY MAPPING
      =================================

      Slider:
        0   = completely invisible
        100 = OLD 75%

      So old 75% is now treated
      as the new maximum.
      */

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
            1.1;

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
            ) ||
            1;

          const push =
            Math.max(
              0,

              1 -
                distance /
                  105
            ) *
            2.05;

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

        /*
        When strength === 0,
        alpha === 0 exactly.
        */

        const alpha =
          Math.min(
            0.9,

            (
              0.17 +
              particle.darkness *
                0.7
            ) *
              strength
          );

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

      /*
      Make atmospheric dust obey
      the same opacity slider.
      */

      const dustAlpha =
        (
          darkRef.current
            ? 0.13
            : 0.08
        ) *
        strength;

      context.fillStyle =
        `rgba(
          ${ink},
          ${dustAlpha}
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
                    0.00032 +
                    speck.phase
                ) *
                4
          );

        const y =
          speck.y +
          (
            reducedMotion
              ? 0
              : Math.cos(
                  time *
                    0.00036 +
                    speck.phase
                ) *
                4.5
          );

        context.fillText(
          "·",
          x,
          y
        );
      }
    }

    function animate(
      time
    ) {
      frame =
        requestAnimationFrame(
          animate
        );

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

    function move(
      event
    ) {
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
      if (
        reducedMotion &&
        ready
      ) {
        draw(
          0,
          1
        );
      }
    }

    image.onload =
      () => {
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
      imageSrc;

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
        "creation-redraw",
        redraw
      );
    };
  }, [
    imageSrc,
    zoom,
    verticalBias,
    horizontalBias,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="creation-ascii"
      aria-hidden="true"
    />
  );
}

export default function AsciiCreationStudy({
  label,
  kicker,
  title,
  subtitle,
  description,
  imageSrc,
  nextHref,
  nextLabel,
  previousHref,
  previousLabel,
  zoom = 1,
  verticalBias = 0,
  horizontalBias = 0,
}) {
  /*
  100 now visually equals
  what old ~75 looked like.
  */

  const [
    intensity,
    setIntensity,
  ] = useState(100);

  const [
    dark,
    setDark,
  ] = useState(false);

  return (
    <main
      className={`creation-page creation-page--study ${
        dark
          ? "creation-page--dark"
          : ""
      }`}
    >
      <header className="creation-header">
        <a
          href="#/intro"
          className="creation-emblem"
          aria-label="Victor — return to intro"
        >
          v.
        </a>

        <nav aria-label="ASCII studies">
          <a href="#/creation">
            ORIGINAL
          </a>

          <a href="#/creation-tree-moon">
            TREE / MOON
          </a>

          <a href="#/creation-moon-gate">
            MOON GATE
          </a>

          <a href="#/creation-golden-gate">
            GOLDEN GATE
          </a>
        </nav>
      </header>

      <section
        className="creation-frame creation-frame--study"
        aria-label="Interactive typographic ASCII illustration"
      >
        <AsciiImageField
          imageSrc={
            imageSrc
          }
          intensity={
            intensity
          }
          dark={
            dark
          }
          zoom={
            zoom
          }
          verticalBias={
            verticalBias
          }
          horizontalBias={
            horizontalBias
          }
        />

        <span className="creation-frame-label">
          {label}
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
            aria-label="Drawing opacity"
            type="range"

            /*
            IMPORTANT:
            full 0 → 100 range now.
            */
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

        <div className="creation-intro creation-intro--study">
          <p className="creation-kicker">
            {kicker}
          </p>

          <h1>
            {title}

            <span
              className="creation-cursor"
              aria-hidden="true"
            >
              .
            </span>
          </h1>

          <p className="creation-subtitle">
            {subtitle}
          </p>

          <p className="creation-description">
            {description}
          </p>

          <div className="creation-study-links">
            <a
              href={
                previousHref
              }
              className="creation-study-link"
            >
              ←{" "}
              {
                previousLabel
              }
            </a>

            <a
              href={
                nextHref
              }
              className="creation-enter"
            >
              {
                nextLabel
              }{" "}
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>

        <span
          className="creation-coordinate"
          aria-hidden="true"
        >
          MOVE YOUR CURSOR TO
          DISTURB THE IMAGE
        </span>
      </section>
    </main>
  );
}