import { NAV_LINKS, SHELF_COLLECTIONS } from "../content/siteContent";

export default function Sidebar({ activeSection, activeShelf, onNavigate, onShelfNavigate }) {
  return (
    <aside className="side-nav" aria-label="Page sections">
      <nav className="side-nav-inner">
        {NAV_LINKS.map(link => (
          <div className="side-nav-group" key={link}>
            <button type="button" className={`side-nav-link ${activeSection === link ? "active" : ""}`}
              onClick={() => onNavigate(link)} aria-current={activeSection === link ? "location" : undefined}
              aria-expanded={link === "Shelf" ? activeSection === "Shelf" : undefined}
              aria-controls={link === "Shelf" ? "shelf-sidebar-links" : undefined}>
              {link}
            </button>
            {link === "Shelf" && (
              <div id="shelf-sidebar-links"
                className={`side-nav-subsections ${activeSection === "Shelf" ? "expanded" : ""}`}
                aria-label="Shelf categories" aria-hidden={activeSection !== "Shelf"}>
                <div className="side-nav-subsections-inner">
                  {SHELF_COLLECTIONS.map(collection => (
                    <button type="button" key={collection.id}
                      className={`side-nav-sublink ${activeSection === "Shelf" && activeShelf === collection.id ? "active" : ""}`}
                      onClick={() => onShelfNavigate(collection.id)}
                      tabIndex={activeSection === "Shelf" ? 0 : -1}
                      aria-current={activeSection === "Shelf" && activeShelf === collection.id ? "location" : undefined}>
                      {collection.label} <span>{collection.items.length}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function MobileSectionNav({ activeSection, onNavigate }) {
  return (
    <div className="section-nav-wrap">
      <div className="segmented">
        {NAV_LINKS.map(link => (
          <button type="button" key={link} className={`seg ${activeSection === link ? "active" : ""}`}
            onClick={() => onNavigate(link)}>
            {link}
          </button>
        ))}
      </div>
    </div>
  );
}
