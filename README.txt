Portfolio component refactor

Copy the contents of this src folder into your existing Vite project's src folder.
Also copy public/intro and public/creation into your existing public folder.
Keep your existing src/main.jsx, src/index.css, src/assets, other public files,
package.json, and Vite configuration. Replace src/App.jsx and src/App.css,
and add the components, content, hooks, lib, pages, and styles folders.

Where to edit content:
  src/content/siteContent.js
    SITE                 Name, tagline, profile photo, bio, location, email
    SITE.intro           Intro page labels and call to action
    EXPERIENCE           Experience rows
    PROJECTS             Project cards and modal details
    COMMUNITIES          Tabs and Polaroid photos
    QUOTES               Philosophy quotes
    SHELF_COLLECTIONS    Books, music, movies, cover images, years, links
    TOP_PAGES/NAV_LINKS  Header and section navigation labels

Use image paths such as "/profile.jpg" and "/shelf/book.jpg" after placing
the actual files in your project's public folder. Empty paths display the
existing placeholders. The Work and Art routes remain intentionally blank.

Component map:
  src/App.jsx                 Small route and page shell
  src/pages/AboutPage.jsx     About page composition and section scrolling
  src/components/TopHeader.jsx, Sidebar.jsx, Footer.jsx
  src/components/Sections.jsx  About, experience, community, quotes, shelf sections
  src/components/Project.jsx  Project cards and modal
  src/components/Shelf.jsx    Shelf covers and year filtering
  src/components/Reveal.jsx   Scroll reveal animation
  src/hooks/useActiveSection.js  Left navigation scroll tracking
  src/hooks/useIntroScroll.js    One-second scroll from the intro into About
  src/styles/motion.css        Motion timings and effects; imported by App.jsx
  src/pages/IntroPage.jsx      Separate landing screen, opened at the root URL
  src/styles/intro.css         Intro layout, logo reveal, and preview animations
  src/pages/CreationPage.jsx   Separate interactive character drawing experiment
  src/styles/creation.css      Experiment layout and theme styles
  src/pages/RipplePage.jsx     Second creation page: text, controls, shape timer
  src/components/ParticleScene.jsx  Canvas lifecycle and pointer events
  src/lib/particleField.js     Generated shapes, springs, glow, and floor ripples
  src/styles/ripple.css        Blue particle page layout and responsive styles
  public/intro/               Victor logo, paintings, cutouts, and studio photos
  public/creation/            Original hand artwork sampled into characters

The intro collage automatically uses the first four entries in PROJECTS.
The Victor logo at the top left of the main site links back to #/intro.
The intro's Enter the site button scrolls down into About and then changes the
URL to #/about. Visitors using reduced motion go directly to About.
The intro also links to the optional #/creation experiment. Its hand artwork
is converted into characters in a canvas; the cursor pushes them away and a
spring returns them to the hand shape. The right slider changes ink intensity.
The Particle study link opens #/creation-2. This separate experiment has blue
sphere, tree, and cube forms, cursor repulsion, spring return, reflected points,
and an outward-rippling floor. Click the scene to add a ripple. Shape buttons
switch manually; Auto cycles every nine seconds. Pause stops the animation.
Reduced motion shows a still scene; manual shape selection remains available.
No new dependencies are required. Change the page text and 9000 ms interval
in RipplePage.jsx; tune spring strength (.032), damping (.86), and cursor force
(.09) in particleField.js. ParticleScene.jsx sets desktop/mobile particle counts.
The center painting starts with the blue flower and changes every 6.5 seconds;
click the artwork to advance it. Edit PAINTINGS in IntroPage.jsx to reorder or
replace the painting images.
The displayed paintings use the transparent *-cutout.png files; the original
photographs are still included. Edit STUDIO_PHOTOS in IntroPage.jsx to change
the two decorative Polaroid photos and captions at the left and right edges.

App.css is the same stylesheet as the previous version, so the appearance
and responsive behavior are retained. Motion additions live in motion.css.
The portfolio opens at #/about; the root URL or #/intro opens the intro.
