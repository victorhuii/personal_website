import { useEffect, useRef } from "react";
import { ProjectLinks } from "../components/FeaturedProjectCard";
import { MISSION_GUARD as project, HOLDOUT_RESULTS, DEVELOPMENT_RESULTS, DETECTION_METHODS, ENGINEERING_DETAILS } from "../content/missionGuard";
import useCursorReveals from "../hooks/useCursorReveals";
import { reducedMotion } from "../utils/motion";
import "../styles/project-study.css";

const SECTIONS = [
  ["problem", "The problem"], ["telemetry", "The data"], ["approach", "What I built"],
  ["results", "Results"], ["architecture", "Architecture"], ["implementation", "Engineering"],
];

function ExternalLink({ href, children }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}<span aria-hidden="true"> ↗</span></a>;
}

function Screenshot({ image, children, priority = false }) {
  return <figure className="project-screenshot">
    <a href={image.src} target="_blank" rel="noopener noreferrer" aria-label="Open full-size screenshot in a new tab">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height}
        loading={priority ? "eager" : "lazy"} decoding="async" />
    </a>
    <figcaption>{children}<span className="project-image-hint">Open image to view at full size <span aria-hidden="true">↗</span></span></figcaption>
  </figure>;
}

function PipelineArrow() {
  return <svg className="project-pipeline-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6" /></svg>;
}

function Architecture() {
  return <figure className="project-architecture" aria-labelledby="architecture-caption">
    <div className="project-pipeline-group">
      <p className="project-kicker">Local research pipeline</p>
      <div className="project-pipeline-node"><strong>NASA/JPL Telemanom</strong><span>Historical SMAP + MSL Parquet channel data</span></div>
      <PipelineArrow />
      <div className="project-pipeline-node"><strong>Python data preparation</strong><span>Chronological splits · sensor and command windows</span></div>
      <PipelineArrow />
      <div className="project-pipeline-branches">
        <div className="project-pipeline-node"><strong>Statistical detectors</strong><span>30-step baseline · 15/30/60-step voting</span></div>
        <div className="project-pipeline-node"><strong>PyTorch LSTM forecasts</strong><span>Sensor-only and command-aware models</span></div>
      </div>
      <PipelineArrow />
      <div className="project-pipeline-node"><strong>Evaluation against NASA labels</strong><span>Timestep classifications · event detection · false-alert runs</span></div>
    </div>
    <PipelineArrow />
    <div className="project-pipeline-group project-pipeline-serving">
      <p className="project-kicker">Public historical replay</p>
      <div className="project-pipeline-node"><strong>Compressed JSON / gzip snapshots</strong><span>Predictions, labels, and metrics for four channels</span></div>
      <PipelineArrow />
      <div className="project-pipeline-node"><strong>Render · FastAPI demo API</strong><span>Paginated historical data; no request-time PyTorch inference</span></div>
      <PipelineArrow />
      <div className="project-pipeline-node"><strong>Cloudflare Pages · React + TypeScript</strong><span>Recharts · synchronized replay · model analytics</span></div>
    </div>
    <figcaption id="architecture-caption">The research pipeline calculates predictions locally. The public API serves exported results to the same dashboard.</figcaption>
  </figure>;
}

export default function MissionGuardPage() {
  const rootRef = useRef(null);
  useCursorReveals(rootRef, true, 100);
  useEffect(() => {
    const previous = document.title;
    document.title = "MissionGuard — Victor Hui";
    return () => { document.title = previous; };
  }, []);

  const navigateToSection = id => {
    const section = document.getElementById(`missionguard-${id}`);
    section?.focus({ preventScroll: true });
    section?.scrollIntoView({ behavior: reducedMotion() ? "instant" : "smooth", block: "start" });
  };

  return <main className="project-study gutter" ref={rootRef} data-cursor-root data-cursor-scope="missionguard">
    <article className="project-study-inner" aria-labelledby="missionguard-title">
      <a className="project-back" href="#/projects"><span aria-hidden="true">←</span> All projects</a>
      <header className="project-study-intro" data-cursor-reveal="text" data-cursor-key="project-introduction">
        <p className="project-kicker">Independent project · 2026</p>
        <h2 id="missionguard-title">MissionGuard</h2>
        <p className="project-study-subtitle">{project.subtitle}</p>
        <p className="project-study-lead">I built a research pipeline and a dashboard to explore a difficult question: when does unusual spacecraft telemetry deserve an alert? The work connects time-series modeling, evaluation, API design, and an interactive application.</p>
        <ProjectLinks project={project} />
        <dl className="project-study-meta">
          <div><dt>My role</dt><dd>Data science, ML, and full-stack engineering</dd></div>
          <div><dt>Data</dt><dd>NASA/JPL Telemanom · SMAP and MSL</dd></div>
          <div><dt>Public demo</dt><dd>Historical, precomputed replay · 4 channels</dd></div>
        </dl>
      </header>

      <Screenshot image={project.dashboard} priority>
        The Telemetry Monitor: select a channel and detector, replay a 300-reading window, and compare predictions with NASA-labeled intervals.
      </Screenshot>

      <nav className="project-study-nav" aria-label="MissionGuard case study sections">
        {SECTIONS.map(([id, label]) => <button type="button" key={id} onClick={() => navigateToSection(id)} aria-controls={`missionguard-${id}`}>{label}</button>)}
      </nav>

      <section id="missionguard-problem" className="project-study-section" tabIndex={-1} aria-labelledby="problem-title">
        <div className="project-section-heading"><p className="project-kicker">The problem</p><h3 id="problem-title">Normal operations can look suspicious.</h3></div>
        <div className="project-prose">
          <p>Spacecraft engineers use telemetry to understand how a system behaves. Across long sensor histories, a sudden shift or a prolonged flatline may warrant investigation. Normal operating changes can produce similar patterns, so reviewing every alert also has a cost.</p>
          <p>I wanted to understand which detection methods could catch unusual behavior without flooding a reviewer with false alarms. I used historical measurements from NASA’s SMAP satellite and Mars Science Laboratory, the Curiosity rover mission, to make those trade-offs visible.</p>
        </div>
      </section>

      <section id="missionguard-telemetry" className="project-study-section" tabIndex={-1} aria-labelledby="telemetry-title">
        <div className="project-section-heading"><p className="project-kicker">Understanding the data</p><h3 id="telemetry-title">One channel is one time series.</h3></div>
        <div className="project-prose">
          <p>A channel tracks sequential readings for one monitored variable or sensor. Telemanom contains 82 channels. Identifiers such as <code>A-2</code> and <code>M-1</code> label dataset channels; they are not public names of diagnosed spacecraft components.</p>
          <p>In my processed inputs, SMAP channels contain one sensor value plus 24 command features; MSL channels contain one sensor value plus 54 command features. I explored the readings alongside command changes, then created univariate and multivariate sliding windows.</p>
          <p>The chart’s horizontal axis is historical timestep. Its sensor values are normalized measurements, rather than physical engineering units. NASA’s shaded anomaly intervals mark unusual telemetry; they do not establish a hardware fault or its cause.</p>
          <ul className="project-chart-key" aria-label="How to read the dashboard">
            <li><span className="project-key-swatch project-key-label" aria-hidden="true" /><span><strong>Red shaded intervals</strong> — NASA’s reference annotations.</span></li>
            <li><span className="project-key-swatch project-key-prediction" aria-hidden="true" /><span><strong>Pink alert points</strong> — a detector’s predictions.</span></li>
          </ul>
          <p className="project-note">Each detector uses a different score scale. Score magnitudes cannot be compared directly across Rolling Std, Multi-Scale, and LSTM.</p>
        </div>
      </section>

      <section id="missionguard-approach" className="project-study-section project-study-section-wide" tabIndex={-1} aria-labelledby="approach-title">
        <div className="project-section-heading"><p className="project-kicker">What I built</p><h3 id="approach-title">From model experiments to an application.</h3></div>
        <div className="project-contributions">
          <div><h4>Data science and machine learning</h4><p>I explored telemetry and command inputs, built reusable sliding-window features, trained PyTorch LSTM forecasters, and implemented statistical detectors. I used chronological validation and evaluated both individual timesteps and complete anomaly events.</p></div>
          <div><h4>Software engineering</h4><p>I built the FastAPI services, a React/TypeScript dashboard, synchronized historical playback, and model-analytics views. I separated local inference from public serving, added tests and CI, and deployed the frontend and demo API.</p></div>
        </div>
        <div className="project-methods">{DETECTION_METHODS.map(method => <div className="project-method" key={method.title}>
          <p className="project-method-detail">{method.detail}</p><h4>{method.title}</h4><p>{method.description}</p>
        </div>)}</div>
        <aside className="project-finding"><h4>Predictable does not always mean normal.</h4><p>On A-2, an anomalous interval contains prolonged near-constant readings. A forecaster can learn that flatline and produce a small prediction error. A low-variance detector is better matched to that pattern. Meanwhile, an abrupt but normal transition can create a large forecasting error and a false alarm.</p></aside>
      </section>

      <section id="missionguard-results" className="project-study-section project-study-section-wide" tabIndex={-1} aria-labelledby="results-title">
        <div className="project-section-heading"><p className="project-kicker">Results and research findings</p><h3 id="results-title">A promising example needed a broader test.</h3></div>
        <div className="project-result-block">
          <h4>Final held-out benchmark · 71 previously unused labeled channels</h4>
          <p>I froze detector settings before evaluation. Each channel’s thresholds were calibrated only on the last 20% of its normal training sequence; test labels were used for evaluation. This comparison covers the two statistical detectors.</p>
          <div className="project-table-wrap" tabIndex={0} role="region" aria-label="71-channel held-out benchmark results">
            <table><caption>Held-out statistical-detector comparison</caption><thead><tr><th scope="col">Metric</th><th scope="col">Rolling Std</th><th scope="col">Multi-Scale</th></tr></thead>
              <tbody>{HOLDOUT_RESULTS.map(row => <tr key={row.metric}><th scope="row">{row.metric}</th><td>{row.rolling}</td><td>{row.multi}</td></tr>)}</tbody>
            </table>
          </div>
          <p><strong>Rolling Std performed better on aggregate F1 and event recall.</strong> Multi-Scale produced fewer false-alert runs, but missed more labeled events. Both micro F1 scores were below 10%, so I retained Rolling Std as a research baseline and documented the generalization limits.</p>
          <p className="project-note">Micro metrics pool timestep counts across channels; macro F1 averages channel F1 scores. Event recall counts an event as detected when at least one labeled timestep is flagged. Explored channels A-1 through A-7, P-1, and M-1 were excluded; P-2 was excluded because of conflicting interval annotations. Not every source-dataset channel is part of this benchmark.</p>
          <p className="project-source"><ExternalLink href={project.sources.holdout}>Published benchmark CSV</ExternalLink><ExternalLink href={project.sources.protocol}>Evaluation protocol</ExternalLink></p>
        </div>

        <div className="project-result-block">
          <h4>Exploratory development channel · A-2</h4>
          <p>Multi-scale voting reduced false-positive timesteps from <strong>19 to 2</strong> while preserving <strong>56 true-positive timesteps</strong>. That is about 89.5% fewer false positives on this explored channel, rather than a cross-channel result.</p>
          <div className="project-table-wrap" tabIndex={0} role="region" aria-label="A-2 exploratory development results">
            <table className="project-development-table"><caption>A-2 development comparison, separate from the held-out benchmark</caption><thead><tr><th scope="col">Detector</th><th scope="col">Precision</th><th scope="col">Recall</th><th scope="col">F1</th><th scope="col">TP</th><th scope="col">FP</th><th scope="col">FN</th></tr></thead>
              <tbody>{DEVELOPMENT_RESULTS.map(row => <tr key={row.method}><th scope="row">{row.method}</th><td>{row.precision}</td><td>{row.recall}</td><td>{row.f1}</td><td>{row.tp}</td><td>{row.fp}</td><td>{row.fn}</td></tr>)}</tbody>
            </table>
          </div>
          <p>Both statistical methods detected A-2’s one labeled event with a median delay of 43 timesteps. False-alert runs fell from 5 to 2. This distinction matters: fewer flagged timesteps and fewer separate alert runs describe different parts of the reviewer’s workload.</p>
          <p className="project-source"><ExternalLink href={project.sources.development}>A-2 evaluation data</ExternalLink><ExternalLink href={project.sources.events}>Event-level results</ExternalLink></p>
        </div>
        <Screenshot image={project.analytics}>The analytics view shown here is A-2 development-channel performance. The 71-channel held-out results are reported separately above.</Screenshot>
      </section>

      <section id="missionguard-architecture" className="project-study-section project-study-section-wide" tabIndex={-1} aria-labelledby="architecture-title">
        <div className="project-section-heading"><p className="project-kicker">System architecture</p><h3 id="architecture-title">Compute locally. Serve a lightweight replay.</h3></div>
        <p className="project-section-lead">The full local service loads model checkpoints and runs inference. For public hosting, I export predictions into small historical artifacts so the demo API can serve the results without loading PyTorch.</p>
        <Architecture />
      </section>

      <section id="missionguard-implementation" className="project-study-section project-study-section-wide" tabIndex={-1} aria-labelledby="implementation-title">
        <div className="project-section-heading"><p className="project-kicker">Technical implementation</p><h3 id="implementation-title">The pieces behind the dashboard.</h3></div>
        <dl className="project-implementation">{ENGINEERING_DETAILS.map(detail => <div key={detail.title}>
          <dt>{detail.title}<code>{detail.paths}</code></dt><dd>{detail.description}</dd>
        </div>)}</dl>
        <div className="project-endpoints"><h4>A few API routes</h4><ul>{["/channels", "/labels/{channel}", "/statistical/{channel}", "/inference/{channel}", "/evaluation/{channel}/events"].map(endpoint => <li key={endpoint}><code>{endpoint}</code></li>)}</ul><ExternalLink href={project.apiDocs}>Explore the API docs</ExternalLink></div>
      </section>

      <section className="project-study-section project-study-section-wide" aria-labelledby="limits-title">
        <div className="project-section-heading"><p className="project-kicker">What I would improve next</p><h3 id="limits-title">Broader anomaly coverage and better calibration.</h3></div>
        <div className="project-prose project-limits-copy">
          <p>The statistical detectors target low-variance behavior, so they can miss other anomaly types. Forecast error can also respond to normal operational changes. I would investigate channel-specific calibration, broader anomaly representations, and event-level alert grouping, then evaluate them on untouched channels.</p>
          <p>The public demo replays historical predictions for A-2, A-7, P-1, and M-1. It does not stream live NASA data or run PyTorch inference at request time. MissionGuard is an independent research prototype, not an operational fault-monitoring service or a NASA-endorsed application.</p>
        </div>
        <div className="project-study-outro"><ProjectLinks project={project} /><p className="project-note">The API may take a moment to wake after inactivity.</p><ExternalLink href={project.readme}>Setup, reproducibility, and project documentation</ExternalLink></div>
      </section>
      <a className="project-back" href="#/projects"><span aria-hidden="true">←</span> Back to projects</a>
    </article>
    <div className="portfolio-agents" data-cursor-layer aria-hidden="true" />
  </main>;
}
