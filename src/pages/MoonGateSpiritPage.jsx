import AsciiCreationStudy from "../components/AsciiCreationStudy";

export default function MoonGateSpiritPage() {
  return (
    <AsciiCreationStudy
      label="création / 004"
      kicker="AN INTERACTIVE ASCII PORTAL"

      title={
        <>
          MOON
          <br />
          GATE
        </>
      }

      subtitle="A circular threshold into another landscape."

      description="A monumental Chinese moon gate frames a distant mountain world. The giant circular structure stays visually simple enough to remain recognizable in ASCII while the moon, lake, pavilion, and mist create depth beyond it."

      imageSrc="/creation/moon-gate-silhouette.png"

      previousHref="#/creation-tree-moon"
      previousLabel="Tree / moon"

      nextHref="#/creation-golden-gate"
      nextLabel="Golden Gate"

      zoom={1.02}

      verticalBias={0}
      horizontalBias={0}
    />
  );
}