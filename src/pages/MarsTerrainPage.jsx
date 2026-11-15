import { useEffect, useRef } from "react";
import { ProjectLinks } from "../components/FeaturedProjectCard";
import { MARS_TERRAIN as project } from "../content/marsTerrain";
import useCursorReveals from "../hooks/useCursorReveals";
import "../styles/project-study.css";

export default function MarsTerrainPage() {
  const rootRef = useRef(null);
  useCursorReveals(rootRef, true, 100);
  useEffect(() => {
    const previous = document.title;
    document.title = "Mars Rover Terrain Segmentation — Victor Hui";
    return () => { document.title = previous; };
  }, []);

  return <main className="project-study gutter" ref={rootRef} data-cursor-root data-cursor-scope="mars-terrain">
    <article className="project-study-inner" aria-labelledby="mars-terrain-title">
      <a className="project-back" href="#/projects"><span aria-hidden="true">←</span> All projects</a>
      <header className="project-study-intro" data-cursor-reveal="text" data-cursor-key="project-introduction">
        <p className="project-kicker">Independent project</p>
        <h2 id="mars-terrain-title">{project.title}</h2>
        <p className="project-study-subtitle">{project.subtitle}</p>
        <p className="project-study-lead">{project.description}</p>
        <ProjectLinks project={project} />
        <dl className="project-study-meta">
          <div><dt>My role</dt><dd>Data preparation, model training and evaluation, frontend, testing and deployment</dd></div>
          <div><dt>Data</dt><dd>AI4Mars · Curiosity rover imagery</dd></div>
          <div><dt>Built with</dt><dd>{project.stack.join(" · ")}</dd></div>
        </dl>
      </header>
      <figure className="project-screenshot mars-terrain-screenshot">
        <a href={project.dashboard.src} target="_blank" rel="noopener noreferrer" aria-label="Open full-size terrain result screenshot">
          <img {...project.dashboard} decoding="async" />
        </a>
        <figcaption>{project.attribution}<span className="project-image-hint">Open image to view at full size ↗</span></figcaption>
      </figure>
      <section className="project-study-section" aria-labelledby="mars-problem">
        <div className="project-section-heading"><p className="project-kicker">The problem</p><h3 id="mars-problem">Identify terrain, pixel by pixel.</h3></div>
        <div className="project-prose"><p>I built a segmentation model to distinguish soil, bedrock, sand and large rocks in historical Mars rover images. The app makes its predictions visible alongside the original image, so people can explore where the model works and where it struggles.</p></div>
      </section>
      <section className="project-study-section" aria-labelledby="mars-data">
        <div className="project-section-heading"><p className="project-kicker">Data science and ML</p><h3 id="mars-data">Remove overlap before training.</h3></div>
        <div className="project-prose">
          <p>I audited 18,130 training rows against all expert image shards and found all 322 unique expert images in the mirror’s training data. I excluded matching images and conservatively linked scene groups, then created reproducible training and validation manifests.</p>
          <p>The clean pool contained 9,154 training images and 1,557 validation images. The selected model trained in stages on up to 4,096 images. I trained a MobileNetV3-small encoder and compact segmentation decoder from scratch on my M1 MacBook Pro, using 256 × 256 RGB inputs.</p>
        </div>
      </section>
      <section className="project-study-section" aria-labelledby="mars-results">
        <div className="project-section-heading"><p className="project-kicker">Verified results</p><h3 id="mars-results">65.8% mean IoU.</h3></div>
        <div className="project-prose">
          <p>I selected the model using validation results, then evaluated it once on the frozen expert <code>test_min3</code> split. Of 322 images, 287 had valid labels; the other 35 were entirely ignored after exclusions. Mean IoU measures overlap between predicted and reference regions.</p>
          <div className="project-table-wrap"><table>
            <caption>Frozen expert test · per-class intersection over union</caption>
            <thead><tr><th scope="col">Terrain</th><th scope="col">IoU</th></tr></thead>
            <tbody>{[["Soil", "84.63%"], ["Bedrock", "81.04%"], ["Sand", "76.92%"], ["Large rocks", "20.66%"]].map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
          </table></div>
          <p>Large rocks were the weakest class, with limited labeled examples. This independent research demonstration has no NASA affiliation or endorsement. Terrain predictions do not establish a safe rover route.</p>
          <p className="project-source"><a href={project.sources.model} target="_blank" rel="noopener noreferrer">Model card ↗</a><a href={project.sources.experiments} target="_blank" rel="noopener noreferrer">Evaluation details ↗</a></p>
        </div>
      </section>
      <section className="project-study-section" aria-labelledby="mars-engineering">
        <div className="project-section-heading"><p className="project-kicker">Software engineering</p><h3 id="mars-engineering">Run the model in the browser.</h3></div>
        <div className="project-prose">
          <p>I exported the roughly 4.4 MB model to ONNX and checked its outputs against PyTorch. The React, TypeScript and Vite app uses ONNX Runtime Web with WASM and is hosted on Cloudflare Pages. Uploaded images stay in the browser.</p>
          <p>Visitors can compare original, mask and overlay views, filter terrain classes, adjust opacity, drag a comparison slider and download a PNG. Predicted pixel coverage describes the image’s composition, separate from the model’s evaluation score.</p>
          <p>The project’s release checks passed 27 Python tests, six frontend unit tests and two production browser tests, including real uploaded-image predictions and a mobile viewport.</p>
          <p className="project-source"><a href={project.sources.architecture} target="_blank" rel="noopener noreferrer">System architecture ↗</a></p>
          <div className="project-study-outro"><ProjectLinks project={project} /></div>
        </div>
      </section>
      <a className="project-back" href="#/projects">← Back to projects</a>
    </article>
    <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />
  </main>;
}
