import { useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { motionSettings, reducedMotion } from "../utils/motion";

// Keep the outgoing state on screen while React commits and reveals its successor.
// Snapshots are inert, contain no duplicate IDs, and never register reveal cursors.
export default function useContentTransition(contentRef) {
  const cleanupRef = useRef(() => {});
  useEffect(() => () => cleanupRef.current(), []);

  return useCallback(update => {
    cleanupRef.current();
    const content = contentRef.current;
    if (!content || reducedMotion()) { update(); return; }
    const parent = content.parentElement;
    const bounds = content.getBoundingClientRect();
    const host = parent.getBoundingClientRect();
    const snapshot = content.cloneNode(true);
    [snapshot, ...snapshot.querySelectorAll("*")].forEach(node => {
      [...node.attributes].forEach(attribute => {
        if (attribute.name === "id" || attribute.name.startsWith("data-cursor") || attribute.name === "data-photo-id") node.removeAttribute(attribute.name);
      });
    });
    snapshot.classList.add("motion-snapshot");
    snapshot.setAttribute("aria-hidden", "true");
    snapshot.inert = true;
    Object.assign(snapshot.style, {
      position: "absolute", margin: "0", pointerEvents: "none",
      left: `${bounds.left - host.left + parent.scrollLeft - parent.clientLeft}px`,
      top: `${bounds.top - host.top + parent.scrollTop - parent.clientTop}px`,
      width: `${bounds.width}px`, height: `${bounds.height}px`,
    });
    parent.append(snapshot);
    flushSync(update);
    const timing = motionSettings();
    const outgoing = snapshot.animate([
      { opacity: 1, transform: "translate(0,0)", filter: "blur(0px)" },
      { opacity: 0, transform: "translate(-6px,-2px)", filter: "blur(2px)" },
    ], { duration: timing.exit, easing: timing.inOut, fill: "both" });
    const incoming = contentRef.current.animate([
      { opacity: 0, transform: "translate(8px,2px)", clipPath: "inset(0 0 6% 0)" },
      { opacity: 1, transform: "translate(0,0)", clipPath: "inset(0 0 0% 0)" },
    ], { duration: timing.enter, easing: timing.out });
    outgoing.onfinish = () => snapshot.remove();
    cleanupRef.current = () => { outgoing.cancel(); incoming.cancel(); snapshot.remove(); };
  }, [contentRef]);
}
