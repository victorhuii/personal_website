import "../styles/ascii-scene.css";

const NAV_LINKS = [
  {
    label: "TREE",
    href: "#/creation-tree-moon",
  },
  {
    label: "KOI",
    href: "#/creation-koi-dragon",
  },
  {
    label: "MOON GATE",
    href: "#/creation-moon-gate",
  },
  {
    label: "SHANSHUI",
    href: "#/creation-shanshui",
  },
];

export default function AsciiSceneShell({
  label,
  title,
  subtitle,
  scene,
}) {
  return (
    <main className="ascii-study-page">
      <header className="ascii-study-header">
        <a
          href="#/creation"
          className="ascii-study-brand"
        >
          creation.
        </a>

        <nav className="ascii-study-nav">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="ascii-study-panel">
        <div className="ascii-study-panel-top">
          <span className="ascii-study-label">
            {label}
          </span>

          <span className="ascii-study-title">
            {title}
          </span>
        </div>

        <div className="ascii-study-scene-wrap">
          <pre className="ascii-study-scene">
            {scene}
          </pre>
        </div>

        <div className="ascii-study-footer">
          <span>{subtitle}</span>

          <a href="#/creation">
            back to creation ↗
          </a>
        </div>
      </section>
    </main>
  );
}