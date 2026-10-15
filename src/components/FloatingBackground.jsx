import { useEffect, useRef } from "react";

function seededRandom(seed = 2026) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function FloatingBackground({
  dark = false,
  contained = false,
}) {
  const canvasRef = useRef(null);
  const darkRef = useRef(dark);

  useEffect(() => {
    darkRef.current = dark;

    canvasRef.current?.dispatchEvent(
      new Event("floating-background-redraw")
    );
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: true,
    });

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;

    let frame = 0;
    let previousTime = 0;

    let stars = [];

    const SPEED_MULTIPLIER = 1.1;

    const DIRECTION_X = 0.48;
    const DIRECTION_Y = 1;

    function createStars() {
      const random = seededRandom(91731);

      const area = width * height;

      const starCount = Math.min(
        190,
        Math.max(
          105,
          Math.round(area / 7600)
        )
      );

      stars = [];

      for (
        let i = 0;
        i < starCount;
        i++
      ) {
        const typeRoll = random();

        let type = "sparkle";

        if (typeRoll < 0.46) {
          type = "sparkle";
        } else if (typeRoll < 0.73) {
          type = "cross";
        } else if (typeRoll < 0.89) {
          type = "fivePoint";
        } else {
          type = "diamond";
        }

        const sizeRoll = random();

        let size =
          1.2 +
          random() * 2.5;

        if (sizeRoll > 0.82) {
          size =
            3.8 +
            random() * 3.2;
        }

        if (sizeRoll > 0.97) {
          size =
            7 +
            random() * 3;
        }

        const speed =
          (58 + random() * 112) *
          SPEED_MULTIPLIER *
          (
            1 -
            Math.min(
              size / 25,
              0.28
            )
          );

        stars.push({
          type,

          x:
            random() *
            width,

          y:
            random() *
            height,

          size,

          opacity:
            0.07 +
            random() * 0.18,

          vx:
            speed *
            (
              DIRECTION_X +
              (random() - 0.5) *
                0.18
            ),

          vy:
            speed *
            (
              DIRECTION_Y +
              (random() - 0.5) *
                0.13
            ),

          rotation:
            random() *
            Math.PI *
            2,

          rotationSpeed:
            (random() - 0.5) *
            0.8,

          streak:
            2 +
            random() * 8,
        });
      }
    }

    function resize() {
      const bounds =
        contained
          ? canvas.parentElement?.getBoundingClientRect()
          : null;

      width =
        contained
          ? bounds?.width || 1
          : window.innerWidth;

      height =
        contained
          ? bounds?.height || 1
          : window.innerHeight;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.25
      );

      canvas.width =
        Math.round(
          width * dpr
        );

      canvas.height =
        Math.round(
          height * dpr
        );

      canvas.style.width =
        `${width}px`;

      canvas.style.height =
        `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createStars();

      draw();
    }

    function getRGB() {
      return darkRef.current
        ? "255,255,255"
        : "100,100,100";
    }

    function getAlpha(star) {
      /*
      NIGHT MODE:
      stars are completely opaque white.
      */

      return darkRef.current
        ? 1
        : star.opacity;
    }

    function drawSparkle(star) {
      const s = star.size;

      ctx.save();

      ctx.translate(
        star.x,
        star.y
      );

      ctx.rotate(
        star.rotation
      );

      ctx.beginPath();

      ctx.moveTo(
        0,
        -s * 1.6
      );

      ctx.lineTo(
        s * 0.26,
        -s * 0.24
      );

      ctx.lineTo(
        s * 1.25,
        0
      );

      ctx.lineTo(
        s * 0.26,
        s * 0.24
      );

      ctx.lineTo(
        0,
        s * 1.6
      );

      ctx.lineTo(
        -s * 0.26,
        s * 0.24
      );

      ctx.lineTo(
        -s * 1.25,
        0
      );

      ctx.lineTo(
        -s * 0.26,
        -s * 0.24
      );

      ctx.closePath();

      ctx.fillStyle =
        `rgba(
          ${getRGB()},
          ${getAlpha(star)}
        )`;

      ctx.fill();

      ctx.restore();
    }

    function drawCross(star) {
      const s = star.size;

      ctx.save();

      ctx.translate(
        star.x,
        star.y
      );

      ctx.rotate(
        star.rotation
      );

      ctx.strokeStyle =
        `rgba(
          ${getRGB()},
          ${getAlpha(star)}
        )`;

      ctx.lineWidth =
        Math.max(
          0.6,
          s * 0.22
        );

      ctx.lineCap =
        "round";

      ctx.beginPath();

      ctx.moveTo(
        0,
        -s
      );

      ctx.lineTo(
        0,
        s
      );

      ctx.moveTo(
        -s,
        0
      );

      ctx.lineTo(
        s,
        0
      );

      ctx.stroke();

      ctx.restore();
    }

    function drawFivePoint(star) {
      const outer =
        star.size;

      const inner =
        outer * 0.42;

      ctx.save();

      ctx.translate(
        star.x,
        star.y
      );

      ctx.rotate(
        star.rotation -
          Math.PI / 2
      );

      ctx.beginPath();

      for (
        let i = 0;
        i < 10;
        i++
      ) {
        const radius =
          i % 2 === 0
            ? outer
            : inner;

        const angle =
          (Math.PI / 5) *
          i;

        const x =
          Math.cos(angle) *
          radius;

        const y =
          Math.sin(angle) *
          radius;

        if (i === 0) {
          ctx.moveTo(
            x,
            y
          );
        } else {
          ctx.lineTo(
            x,
            y
          );
        }
      }

      ctx.closePath();

      ctx.fillStyle =
        `rgba(
          ${getRGB()},
          ${getAlpha(star)}
        )`;

      ctx.fill();

      ctx.restore();
    }

    function drawDiamond(star) {
      const s =
        star.size *
        0.75;

      ctx.save();

      ctx.translate(
        star.x,
        star.y
      );

      ctx.rotate(
        star.rotation
      );

      ctx.beginPath();

      ctx.moveTo(
        0,
        -s
      );

      ctx.lineTo(
        s * 0.55,
        0
      );

      ctx.lineTo(
        0,
        s
      );

      ctx.lineTo(
        -s * 0.55,
        0
      );

      ctx.closePath();

      ctx.fillStyle =
        `rgba(
          ${getRGB()},
          ${getAlpha(star)}
        )`;

      ctx.fill();

      ctx.restore();
    }

    function drawTrail(star) {
      if (star.size > 6) {
        return;
      }

      const magnitude =
        Math.hypot(
          star.vx,
          star.vy
        ) || 1;

      const nx =
        star.vx /
        magnitude;

      const ny =
        star.vy /
        magnitude;

      const trailX =
        star.x -
        nx *
          star.streak;

      const trailY =
        star.y -
        ny *
          star.streak;

      const gradient =
        ctx.createLinearGradient(
          trailX,
          trailY,
          star.x,
          star.y
        );

      const endAlpha =
        darkRef.current
          ? 1
          : star.opacity * 0.55;

      gradient.addColorStop(
        0,
        `rgba(
          ${getRGB()},
          0
        )`
      );

      gradient.addColorStop(
        1,
        `rgba(
          ${getRGB()},
          ${endAlpha}
        )`
      );

      ctx.beginPath();

      ctx.moveTo(
        trailX,
        trailY
      );

      ctx.lineTo(
        star.x,
        star.y
      );

      ctx.strokeStyle =
        gradient;

      ctx.lineWidth =
        Math.max(
          0.45,
          star.size * 0.17
        );

      ctx.stroke();
    }

    function update(delta) {
      for (
        const star of
        stars
      ) {
        star.x +=
          star.vx *
          delta;

        star.y +=
          star.vy *
          delta;

        star.rotation +=
          star.rotationSpeed *
          delta;

        const margin = 30;

        if (
          star.y >
            height + margin ||
          star.x >
            width + margin
        ) {
          star.y =
            -margin -
            Math.random() *
              height *
              0.18;

          star.x =
            Math.random() *
              width *
              0.92 -
            width *
              0.1;
        }
      }
    }

    function draw() {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      for (
        const star of
        stars
      ) {
        drawTrail(star);

        if (
          star.type ===
          "sparkle"
        ) {
          drawSparkle(star);
        }

        if (
          star.type ===
          "cross"
        ) {
          drawCross(star);
        }

        if (
          star.type ===
          "fivePoint"
        ) {
          drawFivePoint(star);
        }

        if (
          star.type ===
          "diamond"
        ) {
          drawDiamond(star);
        }
      }
    }

    function animate(time) {
      frame =
        requestAnimationFrame(
          animate
        );

      if (!previousTime) {
        previousTime = time;
      }

      const delta =
        Math.min(
          0.04,
          (time - previousTime) /
            1000
        );

      previousTime = time;

      update(delta);
      draw();
    }

    function redraw() {
      draw();
    }

    resize();

    let resizeObserver;

    if (
      contained &&
      canvas.parentElement
    ) {
      resizeObserver =
        new ResizeObserver(
          resize
        );

      resizeObserver.observe(
        canvas.parentElement
      );
    } else {
      window.addEventListener(
        "resize",
        resize
      );
    }

    canvas.addEventListener(
      "floating-background-redraw",
      redraw
    );

    if (!reducedMotion) {
      frame =
        requestAnimationFrame(
          animate
        );
    }

    return () => {
      cancelAnimationFrame(
        frame
      );

      resizeObserver?.disconnect();

      window.removeEventListener(
        "resize",
        resize
      );

      canvas.removeEventListener(
        "floating-background-redraw",
        redraw
      );
    };
  }, [contained]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={
        contained
          ? "floating-background floating-background--contained"
          : "floating-background"
      }
      style={{
        position:
          contained
            ? "absolute"
            : "fixed",

        inset: 0,

        width: "100%",
        height: "100%",

        display: "block",

        pointerEvents:
          "none",

        zIndex: 0,
      }}
    />
  );
}