import { useEffect } from "react";
import "../styles/cursor-reveals.css";
import { motionSettings } from "../utils/motion";

const clamp = value => Math.max(0, Math.min(1, value));
const lerp = (start, end, progress) => start + (end - start) * progress;
const random = (min, max) => min + Math.random() * (max - min);
const smooth = value => value * value * (3 - 2 * value);
const COLORS = ["#e38e72", "#68b8aa", "#b39ae1", "#d9b477", "#85a7d6", "#d58cae"];
const APPROACH_SPEED = .9; // Pixels per millisecond, shared by every cursor.
const MAX_SPAWN_DISTANCE = 240; // Maximum starting distance in CSS pixels; smaller on phones.

const nearbySpawn = target => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const padding = Math.min(20, width / 4, height / 4);
  // A partially scrolled target can have its corner outside the viewport.
  // Use its nearest visible corner so the cursor still starts on screen.
  const anchor = {
    x: Math.max(padding, Math.min(width - padding, target.x)),
    y: Math.max(padding, Math.min(height - padding, target.y)),
  };
  const limit = Math.min(MAX_SPAWN_DISTANCE, Math.min(width, height) * .35);
  const angle = random(0, Math.PI * 2);
  const distance = random(limit * .25, limit);
  return {
    x: Math.max(padding, Math.min(width - padding, anchor.x + Math.cos(angle) * distance)),
    y: Math.max(padding, Math.min(height - padding, anchor.y + Math.sin(angle) * distance)),
  };
};
// Document memory survives route changes, and starts fresh on a page refresh.
const revealedTargets = new Set();

const revealIdentity = (root, target) => {
  const scope = root.dataset.cursorScope ?? root.classList[0];
  if (target.dataset.cursorKey) return `${scope}:${target.dataset.cursorKey}`;
  const photo = target.closest("[data-photo-id]");
  if (photo) return `${scope}:photo:${photo.dataset.photoId}`;
  const path = [];
  for (let node = target; node && node !== root; node = node.parentElement) {
    if (node.id) { path.unshift(`#${node.id}`); break; }
    path.unshift(`${node.tagName}:${[...node.parentElement.children].indexOf(node)}`);
  }
  return `${scope}:${path.join("/")}`;
};

const curvePoint = (start, first, second, end, progress) => {
  const remaining = 1 - progress;
  return remaining ** 3 * start + 3 * remaining ** 2 * progress * first
    + 3 * remaining * progress ** 2 * second + progress ** 3 * end;
};

const approachPath = (worker, target) => {
  const dx = target.x - worker.from.x;
  const dy = target.y - worker.from.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const arc = Math.min(110, distance * worker.arc);
  const end = { x: target.x + worker.aim.x, y: target.y + worker.aim.y };
  return {
    first: { x: worker.from.x + dx * worker.firstTurn + normalX * arc, y: worker.from.y + dy * worker.firstTurn + normalY * arc },
    second: { x: worker.from.x + dx * worker.secondTurn + normalX * arc * worker.returnTurn, y: worker.from.y + dy * worker.secondTurn + normalY * arc * worker.returnTurn },
    end,
  };
};

const pathPoint = (worker, path, progress) => ({
  x: curvePoint(worker.from.x, path.first.x, path.second.x, path.end.x, progress),
  y: curvePoint(worker.from.y, path.first.y, path.second.y, path.end.y, progress),
});

// Every target owns a separate cursor, starting at a nearby random screen position.
// Geometry stays relative to that target during scrolling and resizing.
export default function useCursorReveals(rootRef, ready, entranceDelay = 0) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ready) return;
    const layer = root.querySelector("[data-cursor-layer]");
    if (!layer) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = new Set();
    const queued = new Set();
    const pops = new Set();
    const loading = new Map();
    let raf = 0;
    let disposed = false;
    let cursorId = 0;
    const revealAfter = performance.now() + entranceDelay;
    const workers = new Map();
    const active = new Set();
    const createWorker = target => {
      const id = ++cursorId;
      const color = COLORS[(id - 1) % COLORS.length];
      const element = document.createElement("div");
      element.className = "portfolio-agent";
      element.setAttribute("data-reveal-agent", "");
      element.dataset.owner = String(id);
      element.dataset.target = target.closest("[data-photo-id]")?.dataset.photoId || target.id || target.classList[0] || `section-${id}`;
      element.style.setProperty("--agent-color", color);
      element.style.setProperty("--agent-tint", `${color}1c`);
      // Static decorative markup; the hook owns this layer's children.
      element.innerHTML = '<span class="portfolio-agent-frame"></span><span class="portfolio-agent-cursor"><span class="portfolio-agent-press"></span><svg viewBox="0 0 24 28"><path d="m3 2 17 13-8 1-4 8Z" fill="currentColor" stroke="#fffdf5" stroke-width="1.2" stroke-linejoin="round" /></svg></span>';
      target.dataset.cursorOwner = String(id);
      layer.append(element);
      const worker = {
        element,
        cursor: element.querySelector(".portfolio-agent-cursor"),
        frame: element.querySelector(".portfolio-agent-frame"),
        press: element.querySelector(".portfolio-agent-press"),
        target,
        stage: "waiting",
        started: Math.max(performance.now(), revealAfter) + random(0, 60) + (id - 1) % 4 * 30,
      };
      element.dataset.phase = "waiting";
      workers.set(target, worker);
      active.add(worker);
      return worker;
    };

    const bounds = target => {
      const rect = target.getBoundingClientRect();
      const pad = target.dataset.cursorReveal === "image" ? 0 : 5;
      return { x: rect.left - pad, y: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2, top: rect.top, bottom: rect.bottom };
    };
    const show = (target, animate = true) => {
      if (target.dataset.cursorRevealed === "true") return;
      // Keep reveal state outside className, which React updates for active
      // navigation links, pet interactions, and other component state changes.
      target.dataset.cursorRevealed = "true";
      revealedTargets.add(revealIdentity(root, target));
      if (!animate || media.matches) return;
      const timing = motionSettings();
      const opacity = getComputedStyle(target).opacity;
      const transform = getComputedStyle(target).transform;
      const base = transform === "none" ? "" : transform;
      const frames = target.dataset.cursorReveal === "image"
        ? [{ opacity: 0, transform: `${base} scale(.985)`, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, transform: `${base} scale(1)`, clipPath: "inset(0 0 0% 0)" }]
        : [{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity, clipPath: "inset(0 0% 0 0)" }];
      const animation = target.animate(frames, { duration: timing.enter, easing: timing.out });
      pops.add(animation);
      animation.onfinish = () => pops.delete(animation);
    };
    const hide = worker => {
      worker.cursor.style.opacity = "0";
      worker.frame.style.opacity = "0";
      worker.press.style.opacity = "0";
      worker.element.dataset.phase = "done";
      worker.stage = "done";
      active.delete(worker);
      worker.element.remove();
    };
    const move = (worker, x, y) => {
      worker.x = x;
      worker.y = y;
      worker.cursor.style.transform = `translate3d(${x - 2.25}px, ${y - 1.5}px, 0)`;
    };
    const start = (worker, now, rect) => {
      const target = worker.target;
      worker.stage = "approach";
      worker.started = now;
      worker.from = nearbySpawn(rect);
      worker.bend = { x: random(-22, 22), y: random(-16, 16) };
      worker.arc = random(.08, .22) * (Math.random() < .5 ? -1 : 1);
      worker.firstTurn = random(.24, .4);
      worker.secondTurn = random(.63, .82);
      worker.returnTurn = random(-.35, .65);
      worker.dragBend = random(.06, .13) * (Math.random() < .5 ? -1 : 1);
      const dx = rect.x - worker.from.x;
      const dy = rect.y - worker.from.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const overshoot = distance > 90 && Math.random() < .45 ? random(5, 11) : random(-4, 4);
      worker.aim = {
        x: dx / distance * overshoot + random(-3, 3),
        y: dy / distance * overshoot + random(-3, 3),
      };
      worker.correctDuration = random(65, 120);
      worker.dragDuration = target.dataset.cursorReveal === "image" ? random(220, 250) : random(150, 200);
      const path = approachPath(worker, rect);
      let length = 0;
      let previous = worker.from;
      for (let step = 1; step <= 8; step++) {
        const point = pathPoint(worker, path, step / 8);
        length += Math.hypot(point.x - previous.x, point.y - previous.y);
        previous = point;
      }
      worker.approachDuration = Math.max(160, length / APPROACH_SPEED);
      worker.element.dataset.phase = "approach";
      worker.cursor.style.opacity = "1";
    };

    const tick = now => {
      raf = 0;
      if (disposed) return;
      const modalOpen = Boolean(root.querySelector('dialog[open], [role="dialog"][aria-modal="true"]'));
      const measurements = [...active].map(worker => ({ worker, rect: bounds(worker.target) }));
      for (const { worker, rect } of measurements) {
        if (worker.stage === "waiting") {
          if (now < worker.started) continue;
          start(worker, now, rect);
        }
        if (media.matches || modalOpen || rect.bottom < 0 || rect.top > window.innerHeight || !worker.target.isConnected) {
          show(worker.target, false);
          hide(worker);
          continue;
        }
        const elapsed = now - worker.started;
        if (worker.stage === "approach") {
          const progress = clamp(elapsed / worker.approachDuration);
          const point = pathPoint(worker, approachPath(worker, rect), smooth(progress));
          move(worker, point.x, point.y);
          if (progress === 1) {
            worker.stage = "correct";
            worker.correctFrom = { x: worker.x, y: worker.y };
            worker.started = now;
            worker.element.dataset.phase = "correct";
          }
        } else if (worker.stage === "correct") {
          const progress = clamp(elapsed / worker.correctDuration);
          const eased = smooth(progress);
          move(worker, lerp(worker.correctFrom.x, rect.x, eased), lerp(worker.correctFrom.y, rect.y, eased));
          if (progress === 1) {
            worker.stage = "drag";
            worker.started = now;
            worker.element.dataset.phase = "drag";
          }
        } else if (worker.stage === "drag") {
          const progress = clamp((elapsed - 45) / worker.dragDuration);
          const arc = worker.dragBend * Math.sin(progress * Math.PI);
          const x = rect.x + rect.width * smooth(clamp(progress + arc));
          const y = rect.y + rect.height * smooth(clamp(progress - arc));
          move(worker, x, y);
          worker.frame.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;
          worker.frame.style.width = `${x - rect.x}px`;
          worker.frame.style.height = `${y - rect.y}px`;
          worker.frame.style.opacity = "1";
          worker.press.style.opacity = ".65";
          worker.press.style.transform = "scale(.65)";
          if (progress === 1) {
            worker.stage = "release";
            worker.started = now;
            worker.element.dataset.phase = "release";
          }
        } else if (worker.stage === "release") {
          const progress = clamp(elapsed / 85);
          move(worker, rect.x + rect.width, rect.y + rect.height);
          worker.frame.style.transform = `translate3d(${rect.x}px, ${rect.y}px, 0)`;
          worker.frame.style.width = `${rect.width}px`;
          worker.frame.style.height = `${rect.height}px`;
          worker.press.style.transform = `scale(${lerp(.65, 1.8, progress)})`;
          worker.press.style.opacity = String(1 - progress);
          if (progress === 1) {
            show(worker.target);
            worker.stage = "depart";
            worker.started = now;
            worker.element.dataset.phase = "depart";
          }
        } else if (worker.stage === "depart") {
          const progress = clamp(elapsed / 150);
          worker.frame.style.opacity = String(1 - progress);
          worker.cursor.style.opacity = String(1 - progress * .8);
          move(worker, rect.x + rect.width + progress * worker.bend.x * .5, rect.y + rect.height + progress * 10);
          if (progress === 1) hide(worker);
        }
      }
      if (active.size) raf = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!raf && !disposed) raf = requestAnimationFrame(tick); };
    const stopWaiting = target => {
      const pending = loading.get(target);
      if (!pending) return;
      pending.image.removeEventListener("load", pending.handler);
      pending.image.removeEventListener("error", pending.handler);
      loading.delete(target);
    };
    const enqueue = target => {
      if (disposed || !target.isConnected || target.dataset.cursorRevealed === "true") return;
      if (revealedTargets.has(revealIdentity(root, target))) { show(target, false); return; }
      if (media.matches) { show(target, false); return; }
      const image = target.dataset.cursorReveal === "image" ? target.querySelector("img") : null;
      if (image && !image.complete) {
        if (loading.has(target)) return;
        const handler = () => { stopWaiting(target); enqueue(target); };
        loading.set(target, { image, handler });
        image.addEventListener("load", handler);
        image.addEventListener("error", handler);
        return;
      }
      if (workers.has(target)) return;
      createWorker(target);
      schedule();
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const target = entry.target;
        if (!entry.isIntersecting || queued.has(target)) continue;
        queued.add(target);
        observer.unobserve(target);
        enqueue(target);
      }
    }, { threshold: .12, rootMargin: "0px 0px -12px 0px" });
    const register = target => {
      if (targets.has(target)) return;
      targets.add(target);
      if (media.matches || revealedTargets.has(revealIdentity(root, target))) show(target, false);
      else observer.observe(target);
    };
    root.querySelectorAll("[data-cursor-reveal]").forEach(register);
    // Category filtering mounts a new grid. Register its photos without
    // restarting the cover or leaving newly inserted images hidden.
    const mutations = new MutationObserver(records => {
      let removedElements = false;
      records.forEach(record => {
        // Decorative cursor creation/removal cannot add or remove reveal targets.
        if (layer.contains(record.target)) return;
        record.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-cursor-reveal]")) register(node);
          node.querySelectorAll("[data-cursor-reveal]").forEach(register);
        });
        if ([...record.removedNodes].some(node => node instanceof Element)) removedElements = true;
      });
      if (removedElements) {
        targets.forEach(target => {
          if (target.isConnected) return;
          observer.unobserve(target);
          targets.delete(target);
          queued.delete(target);
          stopWaiting(target);
          const worker = workers.get(target);
          if (worker) { hide(worker); workers.delete(target); }
        });
      }
    });
    mutations.observe(root, { childList: true, subtree: true });
    const preferenceChanged = () => {
      if (!media.matches) return;
      targets.forEach(target => show(target, false));
      workers.forEach(hide);
      loading.forEach((_, target) => stopWaiting(target));
      pops.forEach(animation => animation.cancel());
      pops.clear();
    };
    if (media.matches) preferenceChanged();
    media.addEventListener("change", preferenceChanged);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      mutations.disconnect();
      loading.forEach((_, target) => stopWaiting(target));
      media.removeEventListener("change", preferenceChanged);
      pops.forEach(animation => animation.cancel());
      workers.forEach(hide);
    };
  }, [rootRef, ready, entranceDelay]);
}
