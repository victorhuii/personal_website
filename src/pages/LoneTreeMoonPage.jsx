import AsciiCreationStudy from "../components/AsciiCreationStudy";

export default function LoneTreeMoonPage() {
  return (
    <AsciiCreationStudy
      label="création / 003"
      kicker="AN INTERACTIVE ASCII LANDSCAPE"

      title={
        <>
          MOON
          <br />
          TREE
        </>
      }

      subtitle="A lone tree, a full moon, and its reflection."

      description="A quiet landscape reconstructed from keyboard characters. The large tree and moon create an immediately recognizable silhouette while the mountains, fog, and reflection dissolve into softer typographic texture."

      imageSrc="/creation/tree-moon-silhouette.png"

      previousHref="#/creation"
      previousLabel="Original study"

      nextHref="#/creation-moon-gate"
      nextLabel="Moon gate"

      /*
      Artwork sizing inside canvas.
      */
      zoom={1.025}

      verticalBias={0}
      horizontalBias={0}
    />
  );
}