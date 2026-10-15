// EDIT THIS FILE: titles, covers, case studies, screenshots, and real links.
// These four entries are explicitly marked templates, not claimed experience.
// Duplicate an entry, give it a unique id, and replace its content with your work.
// Assets go in public/work/; paths below then look like "/work/project-cover.jpg".

const templateSections = () => [
  {
    label: "My contribution",
    title: "What I owned",
    paragraphs: ["Describe your responsibilities and the specific features or systems you built. Separate your contribution from the team's work."],
    bullets: ["A feature or component you implemented", "A technical decision you made and why"],
  },
  {
    label: "Technical approach",
    title: "How it works",
    paragraphs: ["Explain the architecture, data flow, and key design choices. Include the tradeoffs that matter: reliability, performance, usability, or cost."],
    bullets: ["How data enters and moves through the system", "How you tested and handled failures"],
  },
  {
    label: "Results & lessons",
    title: "What changed",
    paragraphs: ["Add outcomes you can support with evidence. If you measured performance, explain the baseline and how you measured the change. If the work is ongoing, state that clearly."],
    bullets: ["A real result, benchmark, or piece of user feedback", "What you would improve next"],
  },
];

const template = (id, title, summary, category, variant, tones, mark) => ({
  id, title, summary, category, variant, tones, mark,
  template: true,
  year: "",
  role: "Your role",
  stack: [],
  cover: { image: "", video: "", poster: "", alt: "" },
  problem: "Describe the problem this project solves.",
  overview: ["Explain who the project serves, why the problem mattered, and what you built to address it."],
  sections: templateSections(),
  gallery: [], // [{ image: "/work/screen.jpg", title: "Feature name", caption: "Explain what this shows." }]
  links: [
    { label: "Source code", href: "" },
    { label: "Live demo", href: "" },
    { label: "Write-up", href: "" },
  ],
});

export const WORK_INTRO = {
  heading: "Selected work",
  description: "Software engineering, data systems & analytics.",
};

export const WORK_PROJECTS = [
  template("software-project", "Software project", "Your strongest full-stack build.", "Software engineering", "software", ["#e4edf3", "#c9d8e4", "#e9ede9"], "</>"),
  template("data-pipeline", "Data pipeline", "A system that turns raw data into something reliable.", "Data engineering", "pipeline", ["#172c44", "#385a77", "#71959b"], "DB"),
  template("analytics-project", "Analytics project", "A question answered clearly through data.", "Data analytics", "analytics", ["#dfe9e1", "#bacfc6", "#dae1e7"], "↗"),
  template("ai-project", "AI project", "An applied AI project with a practical use case.", "Applied AI", "ai", ["#1f2934", "#526272", "#8ca3b1"], "AI"),
];

// Set template: false once an entry contains your real project details.
// No Side Quest, invented metrics, employer logos, or fabricated job history.
