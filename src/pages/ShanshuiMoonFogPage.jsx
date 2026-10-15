import AsciiCreationStudy from "../components/AsciiCreationStudy";

export default function ShanshuiMoonFogPage() {
  return (
    <AsciiCreationStudy
      label="création / 005"
      kicker="AN INTERACTIVE ASCII LANDSCAPE"
      title={
        <>
          SHANSHUI
          <br />
          MOON
        </>
      }
      subtitle="A wider mountain silhouette with moonlight and drifting fog."
      description="This study works better when the source silhouette stays broad and simple. Large mountain shapes, one moon, and fewer fine details make the typographic illustration easier to read."
      imageSrc="/creation/shanshui-silhouette.png"
      ctaHref="#/creation"
      ctaLabel="Back to the original study"
      backHref="#/creation-moon-gate"
      backLabel="Back to the moon gate study"
      artScale={1.06}
      verticalBias={-0.015}
    />
  );
}