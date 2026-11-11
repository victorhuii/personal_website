import { useRef } from "react";

// Native range semantics and value updates; only the affordance deforms on drag.
export default function MotionRange(props) {
  const held = useRef(false);
  const release = event => {
    held.current = false;
    delete event.currentTarget.dataset.held;
    event.currentTarget.style.setProperty("--range-pull", "0px");
  };
  const fill = (Number(props.value) - Number(props.min ?? 0)) / (Number(props.max ?? 100) - Number(props.min ?? 0)) * 100;
  return <input {...props} type="range" className="motion-range" style={{ ...props.style, "--range-fill": `${fill}%` }}
    onPointerDown={event => {
      held.current = true;
      event.currentTarget.dataset.held = "true";
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => {
      if (!held.current) return;
      const input = event.currentTarget;
      const bounds = input.getBoundingClientRect();
      const excess = event.clientY < bounds.top ? event.clientY - bounds.top : event.clientY > bounds.bottom ? event.clientY - bounds.bottom : 0;
      input.style.setProperty("--range-pull", `${excess / (1 + Math.abs(excess) / 24) * .25}px`);
    }}
    onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
    onKeyDown={event => { if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) event.currentTarget.dataset.held = "true"; }}
    onKeyUp={release} onBlur={release} />;
}
