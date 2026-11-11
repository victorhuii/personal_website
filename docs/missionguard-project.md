# MissionGuard portfolio integration

Added to the Projects tab, with a dedicated case study at `#/projects/missionguard`.

## Files and editing

- `src/content/missionGuard.js`: project identity, links, screenshot metadata, benchmark values, detection methods, and implementation notes.
- `src/components/FeaturedProjectCard.jsx`: featured screenshot card and shared external-link actions.
- `src/pages/ProjectsPage.jsx`: featured project listing.
- `src/pages/MissionGuardPage.jsx`: full case study, result tables, architecture, and section navigation.
- `src/styles/project-study.css`: responsive styles using the existing Figtree, zinc/brown tokens, rounded frames, and shared motion durations.
- `src/App.jsx`: direct hash route and active Projects navigation.

The existing Work cards and dialogs, About sections, painting intro, and Photography remain separate.

## Source verification

Project context: the supplied `MissionGuard_Website_Agent_Context.md`.

Repository: <https://github.com/victorhuii/Spacecraft-Anomaly-Project>

Verified repository revision on 2026-11-10: `7fc846ac5eed534d049dfcf883f7ca156af232ef`.

- `reports/final_holdout_summary.csv`: checked all 12 displayed held-out values against the published decimals, rounded to two percentage places; alert-run counts remain integers.
- `demo_data/evaluation/A-2_h1_cmd.json`: checked all 18 A-2 precision/recall/F1 and TP/FP/FN values. This command-aware evaluation is the relevant source, rather than older exploratory LSTM reports.
- `demo_data/events/A-2_h1_cmd.json`: checked statistical-method event counts, false-alert runs, and 43-timestep median delays.
- `src/holdout.py`, `src/detection.py`, `src/data.py`, `demo_data/manifest.json`, and `.github/workflows/ci.yml`: inspected for protocol, implementation, deployment-mode, and CI details.

The case study links to result files at the verified revision. Demo and GitHub calls to action use the public project URLs.

## Original screenshot assets

Copied without alteration from `docs/screenshots/` at the verified revision into `public/projects/missionguard/`:

| Asset | Dimensions | SHA-256 |
| --- | --- | --- |
| `telemetry-dashboard.png` | 3462 × 2110 | `53371a84df2299eb75975d7d37c163fc75a71f7ec640bd4dc2bca6ebc3d8d7f7` |
| `model-analytics.png` | 3450 × 2108 | `72343e46466a295a9b8677d4f87d6799f541dd0bdff7fd3531338a20c25aea00` |

Images have explicit dimensions and descriptive alt text. The analytics screenshot loads lazily; both case-study images link to their full-size originals.

## Important distinctions in the copy

- The 71-channel held-out comparison is statistical-detector evaluation, not an aggregate LSTM benchmark.
- A-2 is an explored development channel. Its 19-to-2 false-positive improvement is not a generalization claim.
- Both held-out micro F1 scores are below 10%; the comparison and limitations are displayed together.
- Public playback serves historical predictions for four channels. It does not ingest live NASA data or run PyTorch inference on public requests.
- NASA interval labels are evaluation references, not verified hardware diagnoses. The project is independent of NASA.
- The 31-test count describes the documented MissionGuard local suite. It does not claim that this website integration reran the separate research repository's tests.

## Validation performed

- Personal website production build: `npm run build`.
- ESLint on all new/changed JavaScript files for this integration.
- Numeric assertions against the published CSV and evaluation JSON.
- Chromium checks at 1440, 768, and 390 pixels: screenshots, external-link destinations, direct/reloaded routes, section navigation, local table overflow, and back navigation.
- Normal-motion checks: cursor reveal, hover caption, and case-study entry.
- Regression checks: existing Work dialogs, About experience tabs, painting intro, Photography navigation, and home slider remain functional.
- Confirmed the public demo frontend returned HTTP 200. The research benchmark and separate Python test suite were not rerun.

No deployment was performed.
