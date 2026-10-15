import { useEffect, useRef, useState } from "react";

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

// Original, code-drawn covers keep empty templates attractive without borrowing
// someone else's company imagery. Your screenshots/videos render above them.
function CoverArtwork({ project }) {
  return <div className={`work-art work-art--${project.variant || "software"}`} aria-hidden="true">
    <div className="work-art-grain" />
    {project.variant === "pipeline" ? <>
      <div className="work-art-grid" />
      <div className="work-pipeline"><span>01</span><i /><span>02</span><i /><span>03</span></div>
      <span className="work-art-word">data, connected.</span>
    </> : project.variant === "analytics" ? <div className="work-art-dashboard">
      <div className="work-art-windowbar"><i /><i /><i /></div>
      <div className="work-art-dashboard-body"><div className="work-art-metrics"><i /><i /><i /></div>
        <div className="work-art-bars">{[36, 56, 42, 75, 62, 89, 76].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div>
      </div>
    </div> : project.variant === "ai" ? <>
      <div className="work-art-grid" />
      <div className="work-art-query"><span>{project.mark || "AI"}</span><i /><i /><i /></div>
      <div className="work-art-snippet work-art-snippet--one"><i /><i /><i /></div>
      <div className="work-art-snippet work-art-snippet--two"><i /><i /><i /></div>
    </> : <div className="work-art-glass"><span>{project.mark || "</>"}</span></div>}
  </div>;
}

export default function WorkCover({ project, priority = false }) {
  const [loadedSource, setLoadedSource] = useState("");
  const videoRef = useRef(null);
  const reduced = useReducedMotion();
  const cover = project.cover || {};
  const source = cover.video || cover.image || "";
  const ready = loadedSource === source;
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) video.pause();
    else video.play().catch(() => {});
  }, [reduced, source]);
  return <div className="work-cover" style={{ "--cover-a": project.tones?.[0] || "#e4edf3", "--cover-b": project.tones?.[1] || "#c9d8e4", "--cover-c": project.tones?.[2] || "#e9ede9" }}>
    <CoverArtwork project={project} />
    {cover.video ? <video key={source} className={`work-cover-media${ready ? " is-ready" : ""}`}
      src={cover.video} poster={cover.poster || undefined} autoPlay={!reduced} muted loop playsInline
      preload="metadata" aria-label={cover.alt || project.title}
      ref={videoRef}
      onLoadedData={() => setLoadedSource(source)} onError={() => setLoadedSource("")} />
      : cover.image ? <img key={source} className={`work-cover-media${ready ? " is-ready" : ""}`}
        src={cover.image} alt={cover.alt || project.title} loading={priority ? "eager" : "lazy"}
        decoding="async" onLoad={() => setLoadedSource(source)} onError={() => setLoadedSource("")} /> : null}
  </div>;
}
