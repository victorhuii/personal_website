import { flushSync } from "react-dom";

// CSS owns the timings so CSS and Web Animations use the same motion system.
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function motionSettings() {
  const style = getComputedStyle(document.documentElement);
  const value = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
  return {
    enter: parseFloat(value("--motion-enter", "220ms")),
    exit: parseFloat(value("--motion-exit", "176ms")),
    move: parseFloat(value("--motion-move", "240ms")),
    stagger: parseFloat(value("--motion-stagger", "30ms")),
    out: value("--motion-out", "cubic-bezier(.2,.8,.2,1)"),
    inOut: value("--motion-in-out", "cubic-bezier(.4,0,.2,1)"),
  };
}

const dialogAnimations = new WeakMap();

export function animateDialog(dialog, trigger, closing = false) {
  if (!dialog || reducedMotion()) return null;
  const timing = motionSettings();
  const previous = dialogAnimations.get(dialog);
  const interrupted = previous?.playState === "running" || previous?.pending;
  const style = getComputedStyle(dialog);
  const current = { opacity: style.opacity, transform: style.transform, clipPath: style.clipPath };
  previous?.cancel();
  const bounds = dialog.getBoundingClientRect();
  const origin = trigger?.isConnected ? trigger.getBoundingClientRect() : null;
  const x = origin ? origin.left + origin.width / 2 - bounds.left : bounds.width / 2;
  const y = origin ? origin.top + origin.height / 2 - bounds.top : bounds.height / 2;
  if (!interrupted) dialog.style.transformOrigin = `${x}px ${y}px`;
  const hidden = { opacity: 0, transform: "scale(.95)", clipPath: "inset(2% round 24px)" };
  const visible = { opacity: 1, transform: "scale(1)", clipPath: "inset(0% round 24px)" };
  const animation = dialog.animate(closing ? [interrupted ? current : visible, hidden] : [hidden, visible], {
    duration: closing ? timing.exit : timing.enter,
    easing: closing ? timing.inOut : timing.out,
    fill: "both",
  });
  dialogAnimations.set(dialog, animation);
  animation.onfinish = () => {
    if (dialogAnimations.get(dialog) === animation) dialogAnimations.delete(dialog);
    if (!closing) animation.cancel();
  };
  return animation;
}

const layoutAnimations = new WeakMap();

// FLIP keeps the existing spread geometry; photographs travel along a shallow arc.
export function animatePhotoLayout(container, update) {
  if (!container || reducedMotion()) { update(); return; }
  const before = new Map([...container.querySelectorAll("[data-photo-id]")].map(photo => [photo.dataset.photoId, photo.getBoundingClientRect()]));
  layoutAnimations.get(container)?.forEach(animation => animation.cancel());
  flushSync(update);
  const timing = motionSettings();
  const animations = [];
  container.querySelectorAll("[data-photo-id]").forEach(photo => {
    const previous = before.get(photo.dataset.photoId);
    const next = photo.getBoundingClientRect();
    if (!previous || next.bottom < 0 || next.top > innerHeight || !next.width || !next.height) return;
    const dx = previous.left - next.left;
    const dy = previous.top - next.top;
    const sx = previous.width / next.width;
    const sy = previous.height / next.height;
    const arc = Math.min(24, Math.hypot(dx, dy) * .08);
    const frames = Array.from({ length: 9 }, (_, index) => {
      const progress = index / 8;
      return {
        transform: `translate(${dx * (1 - progress)}px,${dy * (1 - progress) - Math.sin(progress * Math.PI) * arc}px) scale(${sx + (1 - sx) * progress},${sy + (1 - sy) * progress})`,
        transformOrigin: "0 0", offset: progress,
      };
    });
    animations.push(photo.animate(frames, { duration: timing.move, easing: timing.inOut }));
  });
  layoutAnimations.set(container, animations);
}

export function pulseConfirmation(element) {
  if (!element || reducedMotion()) return;
  element.animate([
    { boxShadow: "0 0 0 0 rgba(135,91,61,.3)" },
    { boxShadow: "0 0 0 8px rgba(135,91,61,0)" },
  ], { duration: motionSettings().move, easing: motionSettings().out });
}
