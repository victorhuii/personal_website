import { useEffect, useRef } from "react";
import "../styles/googly-cursor.css";

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
export default function GooglyCursor() {
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

    const page = document.documentElement;

    // A native dialog paints above every z-index. A manual popover lets the
    // pointer stay in the same browser layer without taking focus or clicks.
    const supportsTopLayer = typeof cursor.showPopover === "function";
    let activeDialog = null;
    const syncCursorLayer = () => {
      if (!supportsTopLayer) return;
      const dialog = [...document.querySelectorAll("dialog[open]")].at(-1) ?? null;
      const visible = cursor.matches(":popover-open");
      if (visible && activeDialog === dialog) return;
      activeDialog = dialog;
      if (visible) cursor.hidePopover();
      cursor.showPopover();
    };
    if (supportsTopLayer) {
      cursor.setAttribute("popover", "manual");
      syncCursorLayer();
    } else {
      page.classList.add("googly-cursor-native-dialog");
    }
    const layerObserver = new MutationObserver(syncCursorLayer);
    layerObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });

    page.classList.add("has-googly-cursor");

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
      schedule();

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
      schedule();
    }

    function handleLeave() {
      cursor.style.opacity = "0";

      started = false;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function schedule() {
      if (!frame && !reducedMotion && !document.hidden) frame = requestAnimationFrame(animate);
    }

    function animate() {
      frame = 0;
      if (!started || document.hidden) return;
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

      if (Math.abs(dotX) + Math.abs(dotY) + Math.abs(velocityX) + Math.abs(velocityY) < .001) {
        dotX = dotY = velocityX = velocityY = 0;
        dot.setAttribute("transform", "translate(0 0)");
      } else schedule();
    }

    function visibilityChanged() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else if (started) schedule();
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

    document.addEventListener("visibilitychange", visibilityChanged);

    return () => {
      layerObserver.disconnect();
      if (supportsTopLayer && cursor.matches(":popover-open")) cursor.hidePopover();
      cursor.removeAttribute("popover");
      page.classList.remove("googly-cursor-native-dialog");
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", visibilityChanged);
      page.classList.remove("has-googly-cursor");

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
    <span
      ref={cursorRef}
      className="googly-cursor"
      aria-hidden="true"
    >
      <svg className="googly-cursor-layer" viewBox="0 0 34 34">
        <circle className="googly-cursor-ring" cx="17" cy="17" r="15.5" />
      </svg>
      <svg className="googly-cursor-layer" viewBox="0 0 34 34">
        <circle ref={dotRef} className="googly-cursor-dot" cx="17" cy="17" r="2.3" />
      </svg>
    </span>
  );
}

