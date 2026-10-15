import { useEffect, useRef } from "react";
import { ParticleField } from "../lib/particleField";

export default function ParticleScene({
  shape,
  replay,
  paused,
  reducedMotion,
  onOpeningComplete,
}) {
  const canvasRef = useRef(null);
  const fieldRef = useRef(null);

  const completeRef = useRef(onOpeningComplete);

  const settingsRef = useRef({
    shape,
    paused,
    reducedMotion,
  });

  useEffect(() => {
    settingsRef.current = {
      shape,
      paused,
      reducedMotion,
    };

    completeRef.current =
      onOpeningComplete;
  }, [
    shape,
    paused,
    reducedMotion,
    onOpeningComplete,
  ]);

  useEffect(() => {
    const field = fieldRef.current;

    if (!field) return;

    if (
      shape === "opening" &&
      !reducedMotion
    ) {
      field.startOpening();
    } else {
      field.setShape(
        shape === "opening"
          ? "tree"
          : shape,
        reducedMotion
      );
    }

    field.draw();
  }, [
    shape,
    replay,
    reducedMotion,
  ]);

  useEffect(() => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const field =
      new ParticleField(
        canvas,
        {
          /*
          OLD VERSION WAS:

          desktop: 36,000
          mobile: 15,000+

          This is much lighter.
          */

          count:
            window.innerWidth <
            700
              ? 8000
              : 18000,
        }
      );

    fieldRef.current = field;

    if (
      settingsRef.current
        .shape === "opening" &&
      !settingsRef.current
        .reducedMotion
    ) {
      field.startOpening();
    } else {
      field.setShape(
        settingsRef.current
          .shape === "opening"
          ? "tree"
          : settingsRef.current
              .shape,
        true
      );
    }

    const pointer = {
      active: false,
      x: 0,
      y: 0,
    };

    let frame = 0;

    let lastFrame = 0;

    /*
    Don't render more than
    50 FPS.

    This should save a lot
    of CPU/GPU usage without
    making the animation feel
    choppy.
    */

    const frameInterval =
      1000 / 50;

    const resize = () => {
      const rect =
        canvas.getBoundingClientRect();

      if (
        !rect.width ||
        !rect.height
      ) {
        return;
      }

      field.resize(
        rect.width,
        rect.height,

        /*
        Lower pixel density.

        Huge Retina canvases
        were also contributing
        to the lag.
        */

        Math.min(
          window.devicePixelRatio ||
            1,
          1.25
        )
      );

      field.draw();
    };

    const move = (event) => {
      const rect =
        canvas.getBoundingClientRect();

      pointer.x =
        event.clientX -
        rect.left;

      pointer.y =
        event.clientY -
        rect.top;

      pointer.active = true;
    };

    const leave = () => {
      pointer.active = false;
    };

    const addRipple = (
      event
    ) => {
      move(event);

      if (
        !settingsRef.current
          .reducedMotion &&
        !settingsRef.current
          .paused
      ) {
        /*
        Ripple no longer happens
        at the cursor.

        Every ripple originates
        at the ROOT of the tree.
        */

        field.ripple();
      }
    };

    const animate = (now) => {
      const elapsedMs =
        now - lastFrame;

      if (
        lastFrame === 0 ||
        elapsedMs >=
          frameInterval
      ) {
        const elapsed =
          lastFrame === 0
            ? 1 / 60
            : Math.min(
                elapsedMs /
                  1000,
                1 / 30
              );

        lastFrame = now;

        if (
          !document.hidden &&
          !settingsRef.current
            .paused &&
          !settingsRef.current
            .reducedMotion
        ) {
          const completed =
            field.step(
              elapsed,
              pointer
            );

          if (completed) {
            completeRef.current?.();
          }

          field.draw();
        }
      }

      frame =
        requestAnimationFrame(
          animate
        );
    };

    let observer;

    if (
      typeof ResizeObserver !==
      "undefined"
    ) {
      observer =
        new ResizeObserver(
          resize
        );

      observer.observe(
        canvas
      );
    } else {
      window.addEventListener(
        "resize",
        resize
      );
    }

    resize();

    canvas.addEventListener(
      "pointermove",
      move
    );

    canvas.addEventListener(
      "pointerdown",
      addRipple
    );

    canvas.addEventListener(
      "pointerleave",
      leave
    );

    canvas.addEventListener(
      "pointerup",
      leave
    );

    canvas.addEventListener(
      "pointercancel",
      leave
    );

    frame =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(
        frame
      );

      observer?.disconnect();

      window.removeEventListener(
        "resize",
        resize
      );

      canvas.removeEventListener(
        "pointermove",
        move
      );

      canvas.removeEventListener(
        "pointerdown",
        addRipple
      );

      canvas.removeEventListener(
        "pointerleave",
        leave
      );

      canvas.removeEventListener(
        "pointerup",
        leave
      );

      canvas.removeEventListener(
        "pointercancel",
        leave
      );

      fieldRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ripple-canvas"
      aria-hidden="true"
    />
  );
}