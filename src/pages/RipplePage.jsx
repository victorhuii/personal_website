import {
  useCallback,
  useEffect,
  useState,
} from "react";

import ParticleScene from "../components/ParticleScene";

import {
  FORMS,
} from "../lib/particleField";

export default function RipplePage() {
  const [shape, setShape] =
    useState("opening");

  const [paused, setPaused] =
    useState(false);

  const [replay, setReplay] =
    useState(0);

  const [
    reducedMotion,
    setReducedMotion,
  ] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      : false
  );

  const onOpeningComplete =
    useCallback(() => {
      setShape("tree");
    }, []);

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const update = () => {
      setReducedMotion(
        media.matches
      );
    };

    media.addEventListener?.(
      "change",
      update
    );

    return () => {
      media.removeEventListener?.(
        "change",
        update
      );
    };
  }, []);

  const replayOpening = () => {
    setPaused(false);

    setShape("opening");

    setReplay(
      (value) =>
        value + 1
    );
  };

  return (
    <main className="ripple-page">
      <ParticleScene
        shape={shape}
        replay={replay}
        paused={paused}
        reducedMotion={
          reducedMotion
        }
        onOpeningComplete={
          onOpeningComplete
        }
      />

      <header className="ripple-header">
        <a
          className="ripple-brand"
          href="#/intro"
          aria-label="Victor — back to intro"
        >
          <img
            src="/intro/victor-mark.png"
            alt="Victor"
          />

          <span>
            PLAYGROUND / 002
          </span>
        </a>

        <nav aria-label="Creation pages">
          <a href="#/creation">
            Study 01
          </a>

          <a
            href="#/creation-2"
            aria-current="page"
          >
            Study 02
          </a>

          <a href="#/about">
            About ↗
          </a>
        </nav>
      </header>

      <div className="ripple-heading">
        <span className="ripple-eyebrow">
          <i />
          AN EXPERIMENT IN MOTION
        </span>

        <h1>
          A little
          <br />
          <em>
            curiosity.
          </em>
        </h1>
      </div>

      <p className="ripple-aside">
        Small things.
        <br />
        Infinite possibilities.
      </p>

      <div className="ripple-bottom">
        <div className="ripple-controls">
          <div
            className="ripple-shapes"
            role="group"
            aria-label="Particle shape"
          >
            {FORMS.map(
              (
                form,
                index
              ) => (
                <button
                  key={form}
                  type="button"
                  aria-pressed={
                    shape ===
                      form ||
                    (reducedMotion &&
                      shape ===
                        "opening" &&
                      form ===
                        "tree")
                  }
                  onClick={() => {
                    setPaused(
                      false
                    );

                    setShape(
                      form
                    );
                  }}
                >
                  <small>
                    0
                    {index +
                      1}
                  </small>

                  {form}
                </button>
              )
            )}
          </div>

          <div className="ripple-playback">
            <button
              type="button"
              onClick={
                replayOpening
              }
              disabled={
                reducedMotion
              }
            >
              Replay opening
            </button>

            <button
              type="button"
              onClick={() =>
                setPaused(
                  (value) =>
                    !value
                )
              }
              disabled={
                reducedMotion
              }
            >
              {paused
                ? "Resume motion"
                : "Pause motion"}
            </button>
          </div>
        </div>

        <div className="ripple-cards">
          <div>
            <span>
              01 / EXPLORE
            </span>

            <h2>
              Make a little
              space.
            </h2>

            <p>
              Move through the
              particles. Watch
              them find their
              way back.
            </p>
          </div>

          <div>
            <span>
              02 / TRANSFORM
            </span>

            <h2>
              A different
              perspective.
            </h2>

            <p>
              A circle gathers
              into leaves.
              Branches grow
              outward and the
              trunk flows down
              into the floor.
            </p>
          </div>

          <div>
            <span>
              03 / CONNECT
            </span>

            <h2>
              Start something
              small.
            </h2>

            <p>
              Click anywhere in
              the scene and
              watch the deeper
              waves travel
              outward.
            </p>
          </div>
        </div>

        <footer>
          <span>
            {reducedMotion
              ? "STILL MODE · REDUCED MOTION"
              : "MOVE TO SCATTER · CLICK TO RIPPLE"}
          </span>

          <a href="#/intro">
            Back to intro ↓
          </a>
        </footer>
      </div>
    </main>
  );
}