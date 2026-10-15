import { useEffect, useState } from "react";
import { NAV_LINKS, SHELF_COLLECTIONS } from "../content/siteContent";

export default function useActiveSection() {
  const [activeSection, setActiveSection] = useState("Hi!");
  const [activeShelf, setActiveShelf] = useState("books");

  useEffect(() => {
    const updateActive = () => {
      let current = "Hi!";
      for (const link of NAV_LINKS.slice(1)) {
        const element = document.getElementById(link.toLowerCase());
        if (element && element.getBoundingClientRect().top <= 210) current = link;
      }
      setActiveSection(current);

      if (current === "Shelf") {
        let currentShelf = SHELF_COLLECTIONS[0]?.id ?? "books";
        for (const collection of SHELF_COLLECTIONS) {
          if (document.getElementById(`shelf-${collection.id}`)?.getBoundingClientRect().top <= 230) {
            currentShelf = collection.id;
          }
        }
        setActiveShelf(currentShelf);
      }
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return { activeSection, activeShelf, setActiveSection, setActiveShelf };
}
