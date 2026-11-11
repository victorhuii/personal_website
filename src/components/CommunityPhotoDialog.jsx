import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animateDialog } from "../utils/motion";

export default function CommunityPhotoDialog({ photo, trigger, onClose }) {
  const dialogRef = useRef(null);
  const figureRef = useRef(null);
  const captionId = useId();
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    const entrance = animateDialog(figureRef.current, trigger);
    return () => {
      entrance?.cancel();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [trigger]);

  useEffect(() => {
    if (!closing) return;
    const dialog = dialogRef.current;
    const exit = animateDialog(figureRef.current, trigger, true);
    if (!exit) { dialog.close(); return; }
    exit.finished.then(() => dialog.close(), () => {});
    return () => exit.cancel();
  }, [closing, trigger]);

  return createPortal(
    <dialog ref={dialogRef} className="community-photo-dialog" aria-labelledby={captionId}
      onClose={event => { if (!event.currentTarget.open) onClose(); }}
      onCancel={event => { event.preventDefault(); setClosing(true); }}
      onClick={event => { if (event.target === event.currentTarget) setClosing(true); }}>
      <button type="button" className="community-photo-close" aria-label="Close photo" disabled={closing} onClick={() => setClosing(true)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
      </button>
      <figure ref={figureRef} className="community-photo-full">
        <div className="community-photo-full-frame"><img src={photo.src} alt={photo.caption} /></div>
        <figcaption id={captionId}>{photo.caption}</figcaption>
      </figure>
    </dialog>, document.body,
  );
}
