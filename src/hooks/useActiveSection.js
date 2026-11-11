import { useEffect, useState } from "react";
import { COMMUNITIES, NAV_LINKS, SHELF_COLLECTIONS } from "../content/siteContent";

export default function useActiveSection() {
  const [activeSection, setActiveSection] = useState("Hi!");
  const [activeShelf, setActiveShelf] = useState(SHELF_COLLECTIONS[0]?.id ?? "");
  const [activeCommunity, setActiveCommunity] = useState(COMMUNITIES[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;
    const sections = NAV_LINKS.slice(1).map(link => ({ link, element: document.getElementById(link.toLowerCase()) }));
    const shelves = SHELF_COLLECTIONS.map(collection => ({ id: collection.id, element: document.getElementById(`shelf-${collection.id}`) }));
    const communities = COMMUNITIES.map(community => ({ id: community.id, element: document.getElementById(`community-${community.id}`) }));
    const updateActive = () => {
      frame = 0;
      let current = "Hi!";
      for (const { link, element } of sections) {
        if (element && element.getBoundingClientRect().top <= 210) current = link;
      }
      setActiveSection(current);

      if (current === "Community") {
        let currentCommunity = COMMUNITIES[0]?.id ?? "";
        for (const { id, element } of communities) {
          if (element?.getClientRects().length && element.getBoundingClientRect().top <= 230) currentCommunity = id;
        }
        setActiveCommunity(currentCommunity);
      }

      if (current === "Shelf") {
        let currentShelf = SHELF_COLLECTIONS[0]?.id ?? "";
        for (const { id, element } of shelves) {
          if (element?.getBoundingClientRect().top <= 230) {
            currentShelf = id;
          }
        }
        setActiveShelf(currentShelf);
      }
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(updateActive); };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const archive = document.getElementById("past-clubs");
    archive?.addEventListener("toggle", scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      archive?.removeEventListener("toggle", scheduleUpdate);
    };
  }, []);

  return { activeSection, activeShelf, activeCommunity, setActiveSection, setActiveShelf, setActiveCommunity };
}
