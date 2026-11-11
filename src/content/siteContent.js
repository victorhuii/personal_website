// EDIT THIS FILE to change your text, photos, projects, community cards, and shelf items.
// Paths starting with / refer to files inside your Vite project's public folder.

export const SITE = {
  name: "victor hui",
  monogram: "VH",
  // Add or reorder roles here to change the typing animation.
  tagline: ["Software Engineer", "Data Analyst", "Data Engineer", "Full Stack Developer", "ML Engineer"],
  email: "victorhui94@gmail.com",
  profilePhoto: "/victor-profile.jpg",
  profileCaption: "",
  resumes: [
    { label: "SWE Resume", href: "/resumes/victor-resume-swe.pdf" },
    { label: "Data Science Resume", href: "/resumes/victor-resume-data-science.pdf" },
  ],
  intro: {
    eyebrow: "Independent designer & maker",
    artworkCaption: "Change painting ↻",
    enterLabel: "Enter portfolio",
    footerNote: "Selected work & things I love",
  },
  about: {
    heading: "hi, i'm victor hui!",
    chineseName: "许俊昇",
    location: "Bay Area · University of California, Berkeley",
    education: "B.A. Data Science & Business and Industrial Analytics",
    paragraphs: [
      "I love exploring the intersection of data science and software engineering, and discovering how these technologies can be applied across different fields such as healthcare and pharmaceuticals, to make a meaningful impact on people's lives.",
      "I'm a hands-on learner who enjoys experimenting with new technologies and watching ideas come to life through projects. I'm especially interested in how AI can elevate human productivity, understand its limits, and push beyond them to bring out more of what people can do.",
      "In the future, I hope to build for causes I believe in and learn from people solving meaningful problems at scale, turning ambitious ideas into things people can actually use.",
      "Outside of work, you'll find me playing badminton, lifting, DJing, cooking and baking, hosting dinner nights with friends, and eating lots of good food.",
      "On campus, I'm actively involved with 2 student organizations: Web Development @ Berkeley as a Software Engineer and Hackathons @ Berkeley as a Sponsorship Director.",
      "Three words to describe me: analytical, purposeful, proactive.",
    ],
  },
  communitiesSubtitle: "The people who make it all worth it ♡",
  philosophySubtitle: "A few reminders for the person I’m becoming.",
};

export const TOP_PAGES = ["Work", "Projects", "About", "Portfolio"];
export const NAV_LINKS = ["Hi!", "Experience", "Community", "Philosophy", "Shelf"];

// Current roles first, then most recent end date; dates come from the resumes.
export const EXPERIENCE = [
  {
    company: "Berkeley Division of Undergraduate Education", role: "Lead Data Analyst", period: "Jan 2026 – Present", location: "Berkeley, CA",
    logo: "/companies/berkeley.svg", logoBackground: "#003262",
    summary: "Building dashboards and validating student data for decisions across 7+ campus departments.",
    highlights: [
      "Cut executive meeting prep by 2 hours per meeting across 7+ campus departments by building Tableau dashboards on 10,000+ undergraduate survey responses for the Chancellor and Vice Provost, with drill-downs by program and course.",
      "Turned 100,000+ student records and survey responses into recommendations for initiatives reaching 30,000+ students, using Python (Pandas), EDA, and validation checks that caught 1,800 duplicate or inconsistent records before reports.",
      "Defined and tracked KPIs with campus department leads and verified each figure in SQL and Excel before every release.",
    ],
    tools: ["Tableau", "Python", "Pandas", "SQL", "Excel", "Exploratory data analysis"],
    achievements: [
      "Saved 2 hours of executive preparation per meeting across 7+ campus departments.",
      "Caught 1,800 duplicate or inconsistent records before reporting.",
      "Informed initiatives reaching 30,000+ students.",
    ],
  },
  {
    company: "Berkeley Seismological Laboratory", role: "Data Science Researcher", period: "May 2026 – Sep 2026", location: "Berkeley, CA",
    logo: "/companies/berkeley.svg", logoBackground: "#003262",
    summary: "Processing seismic waveforms and analyzing velocity changes across California.",
    highlights: [
      "Processed seismic waveforms from 1,000+ California stations in Python, automating quality checks, noise filtering, and 20 Hz resampling to standardize sensor data before cloud-based station-pair cross-correlation analysis.",
      "Supported cloud cross-correlation for a 100+ TB seismic dataset (2008–2025), then analyzed seismic velocity time series and validated measurements against published findings in 3 California regions: Parkfield, Los Angeles, and Ridgecrest.",
    ],
    tools: ["Python", "Signal processing", "Time-series analysis", "Cross-correlation", "Cloud computing"],
    achievements: [
      "Standardized waveforms from 1,000+ stations with automated checks, filtering, and 20 Hz resampling.",
      "Supported cross-correlation of a 100+ TB dataset spanning 2008–2025.",
      "Validated measurements against published findings in Parkfield, Los Angeles, and Ridgecrest.",
    ],
  },
  {
    company: "VRChat", role: "Software Developer · Contract", period: "Jan 2026 – May 2026", location: "Berkeley, CA",
    logo: "/companies/vrchat.png", logoBackground: "#f4f5f6",
    summary: "Built session-tracking services, engagement pipelines, and live monitoring for VRChat worlds.",
    highlights: [
      "Built backend services in Python (FastAPI) for user session tracking and world event logging, processing real-time interaction data across instances with 20–80 concurrent users per session.",
      "Developed data pipelines using Python (Pandas) and PostgreSQL to aggregate engagement metrics, including session duration and interaction frequency, supporting analysis across a platform with 100K+ concurrent users.",
      "Designed a monitoring dashboard using Next.js, Node.js, and Plotly to visualize real-time system metrics, reducing debugging time and improving performance visibility across active sessions.",
    ],
    tools: ["Python", "FastAPI", "Pandas", "PostgreSQL", "Next.js", "Node.js", "Plotly"],
    achievements: [
      "Processed interaction data for sessions with 20–80 concurrent users.",
      "Reduced debugging time and improved visibility into active sessions with live monitoring.",
    ],
  },
  {
    company: "Certis Oncology", role: "Software Developer · PM & Tech Lead · Contract", period: "Aug 2025 – Jan 2026", location: "Berkeley, CA",
    logo: "/companies/certis-oncology.svg", logoBackground: "#102d46",
    summary: "Led 13 engineers and designers building natural-language analysis tools for cancer researchers.",
    highlights: [
      "Built an ETL pipeline in Python (Pandas) and PostgreSQL to ingest, clean, and transform tumor metadata, using per-user schemas to isolate client data for secure analysis and reproducible research queries across clients.",
      "Led 13 engineers and designers in integrating natural-language analysis into a clinical tumor-model query tool that lets researchers at 10+ clients explore the data in plain English and receive structured results with graphs.",
      "Raised clinical query accuracy from 71% to 90% on 150 test questions by reviewing incorrect responses during offline evaluation, identifying recurring errors, and refining prompts based on those findings and researcher feedback.",
    ],
    tools: ["Python", "Pandas", "PostgreSQL", "Angular", "NestJS", "LLM evaluation", "Prompt engineering"],
    achievements: [
      "Improved clinical query accuracy from 71% to 90% on 150 test questions.",
      "Delivered natural-language data exploration for researchers at 10+ clients.",
      "Led a team of 13 engineers and designers.",
    ],
  },
  {
    company: "BLCK UNICRN", role: "Machine Learning Researcher", period: "Jan 2025 – Jun 2025", location: "Berkeley, CA",
    logo: "/companies/blck-unicrn.svg", logoBackground: "#17151f",
    summary: "Segmented customer behavior and built models for subscription and lifetime-value prediction.",
    highlights: [
      "Segmented 1,200+ users with K-means in Python and SQL on AWS, using feature engineering and dimensionality reduction to compare weekly retention across behavioral cohorts during a period when retention rose 8%.",
      "Designed and ran A/B tests and checked statistical significance, then trained scikit-learn and TensorFlow models with cross-validation and tuning to predict subscription behavior and customer lifetime value (AUC 0.84 vs. 0.71 baseline).",
      "Automated pipelines and dashboards to track AUC, precision/recall, and RMSE so the team could spot model drift early.",
    ],
    tools: ["Python", "SQL", "AWS", "scikit-learn", "TensorFlow", "K-means", "A/B testing"],
    achievements: [
      "Reached an AUC of 0.84 against a 0.71 baseline.",
      "Identified behavioral cohorts across 1,200+ users during a period when retention rose 8%.",
      "Made model drift easier to spot with automated metric tracking.",
    ],
  },
  {
    company: "Recidiviz", role: "Software Developer · Contract", period: "Jan 2025 – May 2025", location: "Berkeley, CA",
    logo: "/companies/recidiviz.png", logoBackground: "#fff",
    summary: "Built AI-assisted SMS check-ins and review tools that reduced manual drafting and follow-up delays.",
    highlights: [
      "Engineered an LLM-powered SMS check-in system using TypeScript, LangChain, and Twilio, processing 100+ weekly patrol officer case notes into personalized messages, reducing manual drafting time by 60% while flagging urgent needs.",
      "Designed and deployed scalable data pipelines on Firebase, implementing topic schemas, confidence scoring, and scheduling logic to prioritize high-risk cases and reduce officer follow-up delays by 40%.",
      "Built full-stack officer tools, including a case note UI, chat logs, an evaluation framework, and Google Calendar scheduling, enabling review of 200+ client interactions per month with structured evaluation workflows and improved LLM output reliability.",
    ],
    tools: ["TypeScript", "LangChain", "Twilio", "Firebase", "Google Calendar", "LLM evaluation"],
    achievements: [
      "Reduced manual message-drafting time by 60%.",
      "Reduced officer follow-up delays by 40%.",
      "Enabled review of 200+ client interactions per month.",
    ],
  },
  {
    company: "Lafayette Square", role: "Software Developer · Contract", period: "Jan 2025 – May 2025", location: "Berkeley, CA",
    logo: "/companies/lafayette-square.svg", logoBackground: "#eef3ee",
    summary: "Built economic-data APIs and customizable reports for investment teams serving 20+ clients.",
    highlights: [
      "Developed RESTful APIs in Python (Flask) on Snowflake to deliver demographic and economic insights, including housing costs and homeownership, by district, city, and state, improving reliability for 20+ clients and reducing query runtime by approximately 30%.",
      "Built an automatic PDF generator within an admin dashboard and integrated SQL pipelines, enabling investment teams to create customizable reports with adjustable styling through an interchangeable frontend interface.",
    ],
    tools: ["Python", "Flask", "Snowflake", "SQL"],
    achievements: [
      "Reduced query runtime by approximately 30% and improved reliability for 20+ clients.",
      "Enabled investment teams to generate customizable PDF reports from the dashboard.",
    ],
  },
  {
    company: "PayPal", role: "Software Developer · Contract", period: "Sep 2024 – Dec 2024", location: "Berkeley, CA",
    logo: "/companies/paypal.png", logoBackground: "#f0f6ff",
    summary: "Built PRD analytics, multi-agent reviews, and contextual engineering-progress summaries.",
    highlights: [
      "Built a Next.js analytics dashboard to compare PRD readiness metrics, multi-agent review results, and feedback trends, helping product and engineering teams prioritize documentation improvements across individual PRD drafts.",
      "Integrated Jira Epics and Stories, GitHub activity, and Slack updates through REST APIs into an OpenAI chatbot, consolidating PRD-linked records and engineering progress into contextual progress summaries for product teams.",
      "Automated PRD requirements review with CrewAI and LangChain, consolidating multi-agent critiques into structured feedback for product and engineering teams to compare drafts and prioritize targeted PRD revisions.",
    ],
    tools: ["Next.js", "CrewAI", "LangChain", "OpenAI", "REST APIs", "Jira", "GitHub", "Slack"],
    achievements: [
      "Brought PRD readiness, review results, and feedback trends into one analytics dashboard.",
      "Consolidated Jira, GitHub, and Slack updates into contextual progress summaries.",
      "Made multi-agent PRD critiques available as structured, comparable feedback.",
    ],
  },
  {
    company: "Mindful Quality", role: "Machine Learning Engineer Intern", period: "May 2024 – Sep 2024", location: "Berkeley, CA",
    logo: "/companies/mindful-quality.svg", logoBackground: "#fff",
    summary: "Fine-tuned language models for pharmaceutical document classification and report generation.",
    highlights: [
      "Developed a pharmaceutical-based LLM using PyTorch and Transformers with 85% accuracy, using EDA, feature engineering, and hyperparameter tuning to optimize performance, improving analytics accuracy by 30%.",
      "Researched and fine-tuned NLP models for document classification and report generation, optimizing T5 and BART for text generation while implementing custom tokenization for compliance automation and document accuracy.",
      "Improved the company’s overall capacity to efficiently serve clients in the US and India by over 20%.",
    ],
    tools: ["PyTorch", "Transformers", "T5", "BART", "NLP", "Feature engineering", "Hyperparameter tuning"],
    achievements: [
      "Achieved 85% model accuracy and improved analytics accuracy by 30%.",
      "Increased capacity to serve clients in the US and India by over 20%.",
    ],
  },
];

export const COMMUNITIES = [
  {
    id: "wdb",
    name: "Web Development @ Berkeley",
    mark: "WDB",
    logo: "/communities/logos/webatberkeley.jpg",
    websiteUrl: "https://webatberkeley.org/",
    instagramUrl: "https://www.instagram.com/webatberkeley/",
    description: "The people and moments behind the code.",
    photos: [
      { id: "wdb-1", src: "/communities/wdb/fa25-photoshoot.jpg", caption: "FA25 Club Photoshoot", fit: "contain", ratio: "6000 / 3376" },
      { id: "wdb-2", src: "/communities/wdb/sp26-lineage.jpg", caption: "SP26 Head of Lineage", fit: "contain", ratio: "3 / 4" },
      { id: "wdb-3", src: "/communities/wdb/sp25-ski-trip.jpg", caption: "Spring 25 Ski Trip", fit: "contain", ratio: "4 / 3", zoom: 1.1, zoomOrigin: "50% 0%" },
      { id: "wdb-4", src: "/communities/wdb/fa24-retreat.jpg", caption: "FA24 Retreat", fit: "contain", ratio: "3 / 4" },
    ],
  },
  {
    id: "hackathons",
    name: "Hackathons @ Berkeley",
    mark: "H@B",
    logo: "/communities/logos/calhacks.jpg",
    websiteUrl: "https://hackberkeley.org/",
    instagramUrl: "https://www.instagram.com/calhacks/",
    description: "Building things with even cooler people.",
    photos: [
      { id: "hack-1", src: "", caption: "Hackathon weekend!" },
      { id: "hack-2", src: "", caption: "The best team" },
      { id: "hack-3", src: "", caption: "Building together" },
      { id: "hack-4", src: "", caption: "Until next time ♡" },
    ],
  },
  {
    id: "innovative-design",
    name: "Innovative Design",
    past: true,
    mark: "InnoD",
    logo: "/communities/logos/innodatcal.jpg",
    websiteUrl: "https://innovativedesign.club/",
    instagramUrl: "https://www.instagram.com/innodatcal/",
    description: "A creative community bringing design, photography, and ideas to life.",
    photos: [
      { id: "innod-1", src: "", caption: "The InnoD community ♡" },
      { id: "innod-2", src: "", caption: "Creating together" },
      { id: "innod-3", src: "", caption: "A different perspective" },
      { id: "innod-4", src: "", caption: "Little moments, big ideas" },
    ],
  },
  {
    id: "cal-badminton",
    name: "Cal Badminton",
    past: true,
    mark: "Cal",
    logo: "/communities/logos/cal_badminton.jpg",
    websiteUrl: "https://badminton.studentorg.berkeley.edu/",
    instagramUrl: "https://www.instagram.com/cal_badminton/",
    description: "A community built around badminton and a shared love of the game.",
    photos: [
      { id: "badminton-1", src: "", caption: "On court" },
      { id: "badminton-2", src: "", caption: "Good rallies, good company" },
      { id: "badminton-3", src: "", caption: "Practice days" },
      { id: "badminton-4", src: "", caption: "Cal Badminton ♡" },
    ],
  },
];

export const QUOTES = [
  { id: "direction", theme: "Direction over timing", text: "The compass was invented before the clock. Because it’s not about the timing at which you’re moving, but about the direction.", emphasis: "the direction.", symbol: "compass" },
  { id: "belief", theme: "Fly anyway", text: "The bumblebee doesn’t ask whether it should be able to fly. It flies anyway.", emphasis: "It flies anyway.", symbol: "bee" },
  { id: "ambition", theme: "Show up. Do the work.", text: "Do so much work that it becomes unreasonable for you not to succeed.", emphasis: "unreasonable", symbol: "steps" },
  { id: "promise", theme: "A promise to myself", text: "The strongest man in the world vs a man with a promise. You do not need to be extraordinary to live an extraordinary life. You just need a promise and the will to never break that promise.", emphasis: "the will to never break that promise.", symbol: "knot" },
  { id: "courage", theme: "Beyond the harbor", text: "A ship is safest in a harbor. But that’s not what it’s built for.", emphasis: "what it’s built for.", symbol: "sail" },
  { id: "future", theme: "Already becoming", text: "The reason you want it so badly is because the version in the future already has it. God wouldn’t have put it in your head if you couldn’t achieve it.", emphasis: "if you couldn’t achieve it.", symbol: "horizon" },
  { id: "pressure", theme: "Made under pressure", text: "If diamonds can form under pressure, what do you think God is trying to do with you?", emphasis: "what do you think God is trying to do with you?", symbol: "diamond" },
  { id: "moon", theme: "Aim higher", text: "Shoot for the moon. Even if you miss, you’ll land among the stars.", emphasis: "you’ll land among the stars.", symbol: "moon" },
  { id: "problem-solver", theme: "Solve what matters", text: "Don’t be a programmer. Be a problem solver.", emphasis: "Be a problem solver.", symbol: "bulb" },
];

// Photos go in public/community/ and covers in public/shelf/. Empty paths show placeholders.
export const SHELF_COLLECTIONS = [
  {
    id: "music", label: "Music", sourceLabel: "Spotify @vkitorr", sourceUrl: "https://open.spotify.com/user/qybnvhi9ejya1qfy3lq9do6d4",
    items: [
      { title: "Bruno Mars", creator: "Artist", image: "/shelf/artist-bruno-mars.jpg", imageAlt: "Bruno Mars Spotify profile photo", url: "https://open.spotify.com/artist/0du5cEVh5yTK9QJze8zA0C?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=5783dfd6-5859-4e1d-bdfc-f1c4458d5dfa", favorite: true },
      { title: "Malcolm Todd", creator: "Artist", image: "/shelf/artist-malcolm-todd.jpg", imageAlt: "Malcolm Todd Spotify profile photo", url: "https://open.spotify.com/artist/7eKkW1zo5uzW8kUntiiBvz?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=bc3def8e-ce3b-4078-8658-9f54e23a4d81", favorite: true },
      { title: "keshi", creator: "Artist", image: "/shelf/artist-keshi.jpg", imageAlt: "keshi Spotify profile photo", url: "https://open.spotify.com/artist/3pc0bOVB5whxmD50W79wwO?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=470a3c92-4671-4d41-aee8-e2d563cc2bf0", favorite: true },
      { title: "J.Tajor", creator: "Artist", image: "/shelf/artist-j-tajor.jpg", imageAlt: "J.Tajor Spotify profile photo", url: "https://open.spotify.com/artist/0VpMOC5IZU06u29fWjv3qJ?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=3c0db660-f4ed-49cb-97d3-1eb4f9d1fe4a", favorite: true },
      { title: "ISOKNOCK", creator: "Artist", image: "/shelf/artist-isoknock.jpg", imageAlt: "ISOKNOCK Spotify profile photo", url: "https://open.spotify.com/artist/0mmIPiJ8l2gAProE7THr37?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=051e66ff-52dd-4e5a-b10f-1e8650deba13", favorite: true },
    ],
  },
  {
    id: "restaurants", label: "Restaurants", sourceLabel: "Beli @vkitorr", sourceUrl: "https://beliapp.co/app/vkitorr",
    items: [
      { title: "Okonomiyaki Kyochabana Minamisemba", subtitle: "Okonomiyaki", image: "/shelf/restaurant-kyochabana.jpg", imageAlt: "Tomato okonomiyaki from Kyochabana Minamisemba", favorite: true },
      { title: "Daeho Kalbijjim", subtitle: "Korean", image: "/shelf/restaurant-daeho.jpg", imageAlt: "Daeho kalbijjim topped with melted cheese", favorite: true },
      { title: "Lemonleaf Grill", subtitle: "Thai", image: "/shelf/restaurant-lemonleaf.webp", imageAlt: "Shrimp pad Thai from Lemonleaf Grill's website", favorite: true },
      { title: "Yume Ga Arukara", subtitle: "Japanese udon", image: "/shelf/restaurant-yume.jpg", imageAlt: "Fresh broth being poured into a bowl of udon at Yume Ga Arukara", favorite: true },
      { title: "Cremia", subtitle: "Ice cream", image: "/shelf/restaurant-cremia.png", imageAlt: "Cremia soft-serve ice cream in a langue de chat cone", imageFit: "contain", favorite: true },
    ],
  },
  {
    id: "movies", label: "Movies",
    items: [
      { title: "My Neighbor Totoro", image: "/shelf/movie-totoro.jpg", favorite: true },
      { title: "Spirited Away", image: "/shelf/movie-spirited-away.png", favorite: true },
      { title: "Ratatouille", image: "/shelf/movie-ratatouille.jpg", favorite: true },
      { title: "Spider-Man: Into the Spider-Verse", image: "/shelf/movie-spider-verse.jpg", favorite: true },
      { title: "Interstellar", image: "/shelf/movie-interstellar.jpg", favorite: true },
    ],
  },
];

// Company cards share the experience identities above. Add body/mission details
// to an entry later to enable its project dialog.
export const PROJECTS = EXPERIENCE.map(experience => ({
  ...experience,
  hue: [experience.logoBackground, experience.logoBackground],
  year: experience.period, role: "", org: "", with: [], mission: "", body: [],
  video: "", image: "",
}));
