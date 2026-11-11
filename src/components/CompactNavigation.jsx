import { SITE, TOP_PAGES } from "../content/siteContent";
import "../styles/compact-navigation.css";

export default function CompactNavigation({ page }) {
  return <div className="compact-topbar">
    <a className="compact-mark" href="#/" aria-label={`${SITE.name} — home`}>v.</a>
    <nav className="compact-nav" aria-label="Main navigation">
      {TOP_PAGES.map(label => <a key={label} href={`#/${label.toLowerCase()}`}
        aria-current={page === label.toLowerCase() ? "page" : undefined}>{label === "Portfolio" ? "PHOTOGRAPHY" : label.toUpperCase()}</a>)}
    </nav>
  </div>;
}
