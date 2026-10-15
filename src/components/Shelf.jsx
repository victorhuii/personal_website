import { useState } from "react";

function ShelfCover({ item, kind }) {
  return (
    <div className={`shelf-cover ${kind === "music" ? "square" : ""}`}
      style={{ "--cover-a": item.colors[0], "--cover-b": item.colors[1] }}>
      {item.image ? <img src={item.image} alt={`${item.title} cover`} loading="lazy" /> :
        <div className="shelf-cover-placeholder" aria-label={`${item.title} cover placeholder`}>
          <span className="cover-symbol">✳</span>
          <strong>{item.title}</strong>
          <small>{item.creator}</small>
        </div>}
    </div>
  );
}

export default function ShelfCollection({ collection }) {
  const [year, setYear] = useState("All");
  const visibleItems = collection.items.filter(item => year === "All" || item.year === year);

  return (
    <div className="shelf-collection" id={`shelf-${collection.id}`}>
      <div className="shelf-collection-top">
        <div className="shelf-filters" aria-label={`${collection.label} year filter`}>
          <button type="button" className={`shelf-kind ${year === "All" ? "selected" : ""}`}
            onClick={() => setYear("All")} aria-pressed={year === "All"}>
            ★ {collection.label} <span>{collection.items.length}</span>
          </button>
          {collection.years.map(value => <button type="button" key={value}
            className={`shelf-year ${year === value ? "selected" : ""}`}
            onClick={() => setYear(value)} aria-pressed={year === value}>
            {value} <span>{collection.items.filter(item => item.year === value).length}</span>
          </button>)}
        </div>
        {collection.sourceUrl ? <a className="shelf-source" href={collection.sourceUrl} target="_blank" rel="noreferrer">{collection.sourceLabel} ↗</a>
          : <span className="shelf-source">{collection.sourceLabel} ↗</span>}
      </div>
      <div className="shelf-gallery" key={year}>
        {visibleItems.map((item, index) => (
          <figure className="shelf-entry" key={item.title} style={{ animationDelay: `${index * 0.06}s` }}>
            <ShelfCover item={item} kind={collection.id} />
            <figcaption className="shelf-caption">{item.favorite && "Favorite: "}{item.title} — {item.creator}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
