// Keep canvas animation loops asleep while their pixels cannot be seen.
export default function observeAnimationVisibility(element, onChange) {
  let inView = true;
  let previous;
  const update = () => {
    const visible = inView && !document.hidden;
    if (visible === previous) return;
    previous = visible;
    onChange(visible);
  };
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    update();
  });
  observer.observe(element);
  document.addEventListener("visibilitychange", update);
  update();
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", update);
  };
}
