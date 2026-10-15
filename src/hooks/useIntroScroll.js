import { useLayoutEffect, useRef, useState } from "react";

// Keep both pages mounted during the scroll so the About page never flashes in.
export default function useIntroScroll(page, onComplete) {
  const destinationRef = useRef(null);
  const finishedRef = useRef(false);
  const startingRef = useRef(false);
  const [entering, setEntering] = useState(false);

  const enterSite = () => {
    if (page !== "intro" || startingRef.current) return;
    startingRef.current = true;
    setEntering(true);
  };

  useLayoutEffect(() => {
    if (page !== "intro") {
      startingRef.current = false;
      setEntering(false);
      if (finishedRef.current && page === "about") {
        finishedRef.current = false;
        // Removing the intro also removes its height. Reset before the next paint.
        const root = document.documentElement;
        const previousBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        destinationRef.current?.focus({ preventScroll: true });
        root.style.scrollBehavior = previousBehavior;
      }
      return;
    }
    if (!entering || !destinationRef.current) return;

    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    const startY = window.scrollY;
    const targetY = destinationRef.current.getBoundingClientRect().top + startY;
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1000;
    let frame;
    let startTime;

    const finish = () => {
      finishedRef.current = true;
      onComplete();
    };
    const step = time => {
      if (startTime === undefined) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      // A smooth acceleration and deceleration, with no abrupt stop at About.
      const ease = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: startY + (targetY - startY) * ease, left: 0, behavior: "auto" });
      if (progress < 1) frame = requestAnimationFrame(step);
      else finish();
    };

    if (duration === 0) finish();
    else frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [page, entering, onComplete]);

  return { entering, enterSite, destinationRef };
}
