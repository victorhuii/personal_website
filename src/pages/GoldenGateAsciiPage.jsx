import AsciiCreationStudy from "../components/AsciiCreationStudy";

export default function GoldenGateAsciiPage() {
  return (
    <AsciiCreationStudy
      label="création / 005"
      kicker="AN INTERACTIVE ASCII LANDSCAPE"

      title={
        <>
          GOLDEN
          <br />
          GATE
        </>
      }

      subtitle="San Francisco, the bay, fog, and an unmistakable bridge."

      description="A Bay Area landscape reduced to its strongest visual forms: the Golden Gate Bridge towers and suspension cables, rolling fog, the bay, distant hills, and the San Francisco skyline."

      imageSrc="/creation/golden-gate-silhouette.png"

      previousHref="#/creation-moon-gate"
      previousLabel="Moon gate"

      nextHref="#/creation-tree-moon"
      nextLabel="Tree / moon"

      /*
      Slightly larger because the
      bridge benefits from stretching
      almost edge-to-edge.
      */
      zoom={1.045}

      verticalBias={0}
      horizontalBias={0}
    />
  );
}