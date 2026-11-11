import { COMMUNITIES, NAV_LINKS, SHELF_COLLECTIONS } from "../content/siteContent";

export default function Sidebar({ activeSection, activeShelf, activeCommunity, archiveOpen, onNavigate, onShelfNavigate, onCommunityNavigate }) {
  return (
    <aside className="side-nav" aria-label="Page sections">
      <nav className="side-nav-inner" data-cursor-reveal="text" data-cursor-key="section-navigation">
        {NAV_LINKS.map(link => (
          <div className="side-nav-group" key={link}>
            <button type="button" className={`side-nav-link ${activeSection === link ? "active" : ""}`}
              onClick={() => onNavigate(link)} aria-current={activeSection === link ? "location" : undefined}
              aria-expanded={link === "Shelf" || link === "Community" ? activeSection === link : undefined}
              aria-controls={link === "Shelf" ? "shelf-sidebar-links" : link === "Community" ? "community-sidebar-links" : undefined}>
              {link}
            </button>
            {link === "Community" && (
              <div id="community-sidebar-links"
                className={`side-nav-subsections ${activeSection === "Community" ? "expanded" : ""}`}
                aria-label="Communities" aria-hidden={activeSection !== "Community"}>
                <div className="side-nav-subsections-inner">
                  {COMMUNITIES.filter(community => !community.past || archiveOpen).map((community, index) => (
                    <button type="button" key={community.id}
                      className={`side-nav-sublink ${activeSection === "Community" && activeCommunity === community.id ? "active" : ""}`} style={{ "--row-index": index }}
                      onClick={() => onCommunityNavigate(community.id)}
                      tabIndex={activeSection === "Community" ? 0 : -1}
                      aria-current={activeSection === "Community" && activeCommunity === community.id ? "location" : undefined}>
                      {community.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {link === "Shelf" && (
              <div id="shelf-sidebar-links"
                className={`side-nav-subsections ${activeSection === "Shelf" ? "expanded" : ""}`}
                aria-label="Shelf categories" aria-hidden={activeSection !== "Shelf"}>
                <div className="side-nav-subsections-inner">
                  {SHELF_COLLECTIONS.map((collection, index) => (
                    <button type="button" key={collection.id}
                      className={`side-nav-sublink ${activeSection === "Shelf" && activeShelf === collection.id ? "active" : ""}`} style={{ "--row-index": index }}
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
    <div className="section-nav-wrap" data-cursor-reveal="text" data-cursor-key="section-navigation">
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
