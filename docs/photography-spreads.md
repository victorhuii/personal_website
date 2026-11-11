# Photography spread layouts

Reference inspected: [DeeJay Bui — Spread](https://deejaybui.com/spread), including its public Showcase, Studio controls and browser-delivered layout implementation.

The reference evaluates magazine-style templates and photo assignments using crop retention, nearby colors and visual weight. It returns several good arrangements rather than scattering photos randomly. This portfolio uses its own smaller implementation of that approach; it keeps the existing photography cover, category filters, per-photo cursor reveals and lightbox.

## How this implementation works

- Divide the selected collection into balanced groups of at most five photos, avoiding a lone leftover when possible.
- Evaluate original two-column, lead-and-support, staggered-column and contact-sheet compositions, including mirrored alternatives.
- Score assignments by retained image area, protect the worst crop, favor featured photos for bigger frames, and consider average colors and the distribution of dark images.
- Choose from a limited pool of good candidates. Rearrange advances through those alternatives and preserves the actual photo elements, loaded images and completed cursor reveals.
- Calculate separate desktop and mobile arrangements, with CSS selecting the appropriate coordinates. Portrait-heavy desktop groups use a taller sheet.
- Keep a single filtered photo list for the lightbox so every positioned tile still opens the correct photograph.

`src/utils/photoSpreads.js` contains the layout engine. `src/styles/portfolio-spreads.css` controls paper, spacing and responsive positioning. Generation is memoized and does not run on scroll.

Photo dimensions and average RGB `tone` values in `src/content/portfolioContent.js` were measured from the local images. Update these when replacing a photo for the most accurate layout scoring; both fields are optional and new photos still work with fallback values. Existing `position` values control the crop focal point, and `size: "large"` now gives a photo extra priority for a lead frame.

Validation: `node --test src/utils/photoSpreads.test.js` checks all category sets and multiple arrangements, image coverage, overlap/bounds, small/growing collections, repeatability and portrait cropping.
