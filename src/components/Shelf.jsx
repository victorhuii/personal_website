import "../styles/shelf-dropdown.css";

function ShelfCover({ item, kind }) {
  return (
    <div className={`shelf-cover ${kind === "music" || kind === "restaurants" ? "square" : ""}`}
      style={{ "--cover-a": item.colors?.[0] ?? "#e4e4e7", "--cover-b": item.colors?.[1] ?? "#71717a" }}>
      {item.image ? <img src={item.image} alt={item.imageAlt ?? `${item.title} cover`} loading="lazy"
        className={item.imageFit === "contain" ? "shelf-cover-contained" : undefined} /> :
        <div className="shelf-cover-placeholder" aria-label={`${item.title} cover placeholder`}>
          <span className="cover-symbol">✳</span>
          <strong>{item.title}</strong>
          <small>{item.creator}</small>
        </div>}
    </div>
  );
}

export default function ShelfCollection({ collection }) {
  return (
    <div className="shelf-collection" id={`shelf-${collection.id}`} data-kind={collection.id}>
      <div className="shelf-collection-top" data-cursor-reveal="text">
        <h3 className="shelf-kind selected shelf-collection-label">
          ★ {collection.label} <span>{collection.items.length}</span>
        </h3>
        {collection.sourceLabel && (collection.sourceUrl ?
          <a className="shelf-source" href={collection.sourceUrl} target="_blank" rel="noopener noreferrer">{collection.sourceLabel} ↗</a> :
          <span className="shelf-source">{collection.sourceLabel}</span>)}
      </div>
      <div className="shelf-gallery">
        {collection.items.length === 0 && <p data-cursor-reveal="text" className="shelf-empty">{collection.emptyMessage ?? "Coming soon."}</p>}
        {collection.items.map((item, index) => (
          <figure data-cursor-reveal="image" className="shelf-entry" key={item.title} style={{ animationDelay: `${index * 30}ms` }}>
            {item.url ? <a className="shelf-cover-link" href={item.url} target="_blank" rel="noopener noreferrer"
              aria-label={`View ${item.title}${collection.sourceLabel ? ` on ${collection.sourceLabel}` : ""} (opens in a new tab)`}>
              <ShelfCover item={item} kind={collection.id} />
            </a> : <ShelfCover item={item} kind={collection.id} />}
            <figcaption className="shelf-caption">
              {item.title}
              {item.subtitle && <span className="shelf-caption-detail">{item.subtitle}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
