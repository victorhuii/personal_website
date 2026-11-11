// Verified against the supplied project context and published artifacts on 2026-11-10.
// Pin result sources so development-channel results stay separate from the holdout.
const repository = "https://github.com/victorhuii/Spacecraft-Anomaly-Project";
const revision = "7fc846ac5eed534d049dfcf883f7ca156af232ef";
const source = path => `${repository}/blob/${revision}/${path}`;

export const MISSION_GUARD = {
  id: "missionguard",
  title: "MissionGuard",
  subtitle: "NASA spacecraft telemetry anomaly detection",
  route: "#/projects/missionguard",
  description: "I built a Python research pipeline and an interactive dashboard to investigate unusual spacecraft telemetry. I compared LSTM forecasts with statistical detectors, then tested the statistical methods on 71 previously unused NASA channels.",
  stack: ["Python", "PyTorch", "React", "TypeScript", "FastAPI", "Recharts"],
  links: [
    { label: "Live Demo", href: "https://spacecraft-anomaly-project.pages.dev" },
    { label: "GitHub", href: repository },
  ],
  apiDocs: "https://spacecraft-anomaly-project.onrender.com/docs",
  readme: `${repository}/blob/main/README.md`,
  dashboard: {
    src: "/projects/missionguard/telemetry-dashboard.png", width: 3462, height: 2110,
    alt: "MissionGuard Telemetry Monitor showing channel A-2, historical replay controls, sensor readings, NASA-labeled anomaly intervals, and statistical detection scores.",
  },
  analytics: {
    src: "/projects/missionguard/model-analytics.png", width: 3450, height: 2108,
    alt: "MissionGuard analytics comparing Rolling Std, Multi-Scale, and command-aware LSTM on development channel A-2, with F1 scores and classification counts.",
  },
  sources: {
    holdout: source("reports/final_holdout_summary.csv"),
    protocol: source("src/holdout.py"),
    development: source("demo_data/evaluation/A-2_h1_cmd.json"),
    events: source("demo_data/events/A-2_h1_cmd.json"),
    data: source("src/data.py"),
    detection: source("src/detection.py"),
    manifest: source("demo_data/manifest.json"),
    ci: source(".github/workflows/ci.yml"),
  },
};

export const HOLDOUT_RESULTS = [
  { metric: "Micro precision", rolling: "9.02%", multi: "8.16%" },
  { metric: "Micro recall", rolling: "8.96%", multi: "7.77%" },
  { metric: "Micro F1", rolling: "8.99%", multi: "7.96%" },
  { metric: "Macro F1", rolling: "3.40%", multi: "2.67%" },
  { metric: "Event recall", rolling: "29.35%", multi: "22.83%" },
  { metric: "False alert runs", rolling: "1,165", multi: "1,018" },
];

export const DEVELOPMENT_RESULTS = [
  { method: "Rolling Std", precision: "74.67%", recall: "50.45%", f1: "60.22%", tp: 56, fp: 19, fn: 55 },
  { method: "Multi-Scale", precision: "96.55%", recall: "50.45%", f1: "66.27%", tp: 56, fp: 2, fn: 55 },
  { method: "Command-aware LSTM", precision: "7.55%", recall: "3.60%", f1: "4.88%", tp: 4, fp: 49, fn: 107 },
];

export const DETECTION_METHODS = [
  {
    title: "Rolling standard deviation", detail: "30-timestep baseline",
    description: "I measure rolling variability and flag windows below a 1st-percentile threshold calibrated on normal validation data. This targets unusually constant readings, including sustained flatlines.",
  },
  {
    title: "Multi-scale voting", detail: "15, 30, and 60 timesteps",
    description: "Each window votes when variability is unusually low; at least two of the three must agree. Windows whose calibrated threshold is zero are disabled without relaxing the two-vote requirement.",
  },
  {
    title: "LSTM forecasting", detail: "Univariate and command-aware models",
    description: "I trained PyTorch models to forecast sensor readings, using prediction error as the anomaly score. I compared sensor-only inputs with sensor-plus-command windows and explored single-step and longer-horizon forecasts.",
  },
];

export const ENGINEERING_DETAILS = [
  {
    title: "Data and evaluation", paths: "src/data.py · src/detection.py · src/holdout.py",
    description: "Reusable channel loaders and sliding windows feed the models. Evaluation aligns predictions with NASA intervals and reports precision, recall, F1, confusion counts, false-alert runs, and detection delay. Chronological 80/20 splits keep future observations out of training.",
  },
  {
    title: "Local inference API", paths: "api/main.py",
    description: "FastAPI loads research data and model checkpoints for local inference and evaluation. I added validated inputs, pagination, aligned model/statistical timelines, and lru_cache for expensive repeated inference.",
  },
  {
    title: "Dashboard and replay", paths: "frontend/src/App.tsx · AnalyticsPanel.tsx · api.ts",
    description: "React, TypeScript, and Recharts power synchronized telemetry and anomaly-score plots, a 300-reading viewport, detector/checkpoint selection, and playback with scrubbing and speed controls. AbortController prevents stale requests from replacing a newer channel selection.",
  },
  {
    title: "Public serving and deployment", paths: "src/export_demo.py · api/demo.py",
    description: "The exporter packages historical predictions, labels, and evaluations into 25 artifacts totaling about 1.1 MB. A separate lightweight FastAPI app serves those outputs on Render; Cloudflare Pages hosts the frontend. Environment-based API URLs and CORS connect the two deployments.",
  },
  {
    title: "Tests and continuous integration", paths: "tests/ · .github/workflows/ci.yml",
    description: "The documented local suite passed 31 Python tests covering data windows, detectors, both APIs, labels, and timeline alignment. Demo endpoint tests use temporary synthetic fixtures. GitHub Actions runs the Python tests and builds the TypeScript frontend on pushes and pull requests.",
  },
];
