# Mars Rover Terrain Segmentation

Route: `/#/projects/mars-terrain`.

Content follows the complete [project handoff](https://github.com/victorhuii/Mars-Rover-Terrain-Segmentation/blob/main/docs/PERSONAL_WEBSITE_HANDOFF.md) and its model card. The result is **65.8% mean IoU**, not accuracy. The clean data pool is separate from the up to 4,096 images used to train the selected model.

Screenshot: `public/projects/mars-terrain/terrain-result.png`, downloaded unchanged from `docs/assets/terrain-result.png` in the project repository. Original dimensions: 1320 × 1614. Descriptive alt text is in `src/content/marsTerrain.js`; the detail-page caption retains: “Rover imagery: NASA/JPL-Caltech; dataset: AI4Mars, Swan et al.”

The model is an independent research demonstration with no NASA affiliation or endorsement; terrain predictions do not establish safe rover routes. Project release test counts describe the Mars application, not this website’s tests.

Validation: `npm run check` passed (four layout tests, production build and Pages hosting checks); targeted ESLint passed for the new page/content and changed routes. Chrome production-preview checks passed at 1440 px and 390 px: both cards and screenshot loaded, case-study navigation worked, image aspect ratio was preserved, no horizontal overflow or page errors. Chrome returned HTTP 200 for the live demo and GitHub repository. An isolated copy of HEAD plus only these Mars files also passed the deployment checks.
