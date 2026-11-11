import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { motionSettings, reducedMotion } from "../utils/motion";

export default function useDisclosureMotion(detailsRef, bodyRef, open, onChange) {
  const animationRef = useRef(null);
  useEffect(() => () => animationRef.current?.cancel(), []);
  return event => {
    event.preventDefault();
    const details = detailsRef.current;
    const body = bodyRef.current;
    const opening = !open || details.dataset.closing === "true";
    const style = getComputedStyle(body);
    const interrupted = Boolean(animationRef.current);
    const height = details.open ? parseFloat(style.height) || body.getBoundingClientRect().height : 0;
    const opacity = interrupted ? style.opacity : opening ? 0 : 1;
    const transform = interrupted ? style.transform : opening ? "scale(.95) translateY(-4px)" : "scale(1) translateY(0)";
    animationRef.current?.cancel();
    delete details.dataset.closing;
    delete details.dataset.animating;
    if (reducedMotion()) { onChange(opening); return; }
    const timing = motionSettings();
    details.dataset.animating = "true";
    if (opening) flushSync(() => onChange(true));
    else details.dataset.closing = "true";
    const fullHeight = body.scrollHeight;
    const animation = body.animate([
      { height: `${height}px`, opacity, transform },
      { height: `${opening ? fullHeight : 0}px`, opacity: opening ? 1 : 0, transform: opening ? "scale(1) translateY(0)" : "scale(.95) translateY(-4px)" },
    ], { duration: opening ? timing.enter : timing.exit, easing: opening ? timing.out : timing.inOut, fill: "both" });
    animationRef.current = animation;
    animation.onfinish = () => {
      if (!opening) flushSync(() => onChange(false));
      delete details.dataset.closing;
      delete details.dataset.animating;
      animation.cancel();
      animationRef.current = null;
    };
  };
}
