import { SITE, TOP_PAGES } from "../content/siteContent";

export default function TopHeader({ page }) {
  return (
    <header className="site-heading gutter">
      <div className="site-heading-inner">
        <a className="identity-mark" href="#/" aria-label={`${SITE.name} — back to landing page`}>
          <span aria-hidden="true">v.</span>
        </a>
        <div className="identity-copy">
          <h1>{SITE.name}</h1>
          <p>{SITE.tagline[0]}<br />{SITE.tagline[1]}</p>
        </div>
        <nav className="top-links" aria-label="Main navigation">
          {TOP_PAGES.map(label => {
            const route = label.toLowerCase();
            return (
              <a key={route} href={`#/${route}`} className={page === route ? "active" : ""}
                aria-current={page === route ? "page" : undefined}>
                {label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
