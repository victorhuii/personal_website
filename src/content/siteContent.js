// EDIT THIS FILE to change your text, photos, projects, community cards, and shelf items.
// Paths starting with / refer to files inside your Vite project's public folder.

export const SITE = {
  name: "victor hui",
  monogram: "VH",
  tagline: ["Art, business, technology,", "& everything in between."],
  email: "YOUR_EMAIL@example.com",
  footerCta: "Let's work together!",
  profilePhoto: "", // e.g. "/profile.jpg"
  profileCaption: "Add a favorite photo here",
  intro: {
    eyebrow: "Independent designer & maker",
    artworkCaption: "Change painting ↻",
    enterLabel: "Enter the site",
    footerNote: "Selected work & things I love",
  },
  about: {
    heading: "Hi, I'm Victor!",
    location: "Berkeley, California",
    education: "University of California, Berkeley",
    paragraphs: [
      "I love art, business, technology, & the ways they can work together to create extraordinary products for people.",
      { before: "I view myself as an artist at heart, designing where beauty meets tactile utility. My ", linkText: "ikigai", linkUrl: "https://en.wikipedia.org/wiki/Ikigai", after: " is the pursuit of an intersection between passion, profession, & personal mission." },
      "3 words to describe me: Golden Retriever Energy (even on the bad days).",
    ],
  },
  communitiesSubtitle: "The people who make it all worth it ♡",
  philosophySubtitle: "a.k.a. my Design ( + Life ) Philosophy",
};

export const TOP_PAGES = ["Work", "Art", "About"];
export const NAV_LINKS = ["Hi!", "Experience", "Community", "Philosophy", "Shelf"];

export const EXPERIENCE = [
  { company: "Luma", role: "Product Design Intern", period: "2024", tag: "product" },

  { company: "Google", role: "UX Research Intern", period: "2023", tag: "research" },

  { company: "UCLA Design Lab", role: "Design Lead", period: "2022–2023", tag: "design" },

  { company: "Figma", role: "Community Ambassador", period: "2022", tag: "community" },

];

export const COMMUNITIES = [
  {
    id: "wdb",
    name: "Web Development @ Berkeley",
    description: "The people and moments behind the code.",
    photos: [
      { id: "wdb-1", src: "", caption: "WDB family ♡" },
      { id: "wdb-2", src: "", caption: "Late nights, good company" },
      { id: "wdb-3", src: "", caption: "Making memories" },
      { id: "wdb-4", src: "", caption: "Behind the scenes" },
    ],
  },
  {
    id: "hackathons",
    name: "Hackathons @ Berkeley",
    description: "Building things with even cooler people.",
    photos: [
      { id: "hack-1", src: "", caption: "Hackathon weekend!" },
      { id: "hack-2", src: "", caption: "The best team" },
      { id: "hack-3", src: "", caption: "Building together" },
      { id: "hack-4", src: "", caption: "Until next time ♡" },
    ],
  },
];

export const QUOTES = [
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },

  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },

  { text: "Everything is designed. Few things are designed well.", author: "Brian Reed" },

];

// Photos go in public/community/ and covers in public/shelf/. Empty paths show placeholders.
export const SHELF_COLLECTIONS = [
  {
    id: "books", label: "Books", years: ["2026", "2025", "2024"], sourceLabel: "Goodreads", sourceUrl: "",
    items: [
      { title: "The Design of Everyday Things", creator: "Don Norman", year: "2026", image: "", favorite: true, colors: ["#edc76c", "#467775"] },
      { title: "Thinking, Fast and Slow", creator: "Daniel Kahneman", year: "2025", image: "", favorite: true, colors: ["#faf2de", "#9e6c55"] },
      { title: "Atomic Habits", creator: "James Clear", year: "2024", image: "", favorite: false, colors: ["#e5e0d7", "#654a41"] },
      { title: "Steal Like an Artist", creator: "Austin Kleon", year: "2026", image: "", favorite: true, colors: ["#111827", "#f2f1e8"] },
    ],
  },
  {
    id: "music", label: "Music", years: ["2026", "2025", "2024"], sourceLabel: "Spotify", sourceUrl: "",
    items: [
      { title: "Blonde", creator: "Frank Ocean", year: "2026", image: "", favorite: true, colors: ["#dce5c9", "#3c725c"] },
      { title: "Be the Cowboy", creator: "Mitski", year: "2025", image: "", favorite: false, colors: ["#d1bac6", "#663c5b"] },
      { title: "SOUR", creator: "Olivia Rodrigo", year: "2024", image: "", favorite: true, colors: ["#d6b2e0", "#7956a6"] },
    ],
  },
  {
    id: "movies", label: "Movies", years: ["2026", "2025", "2024"], sourceLabel: "Letterboxd", sourceUrl: "",
    items: [
      { title: "Everything Everywhere All at Once", creator: "2022", year: "2026", image: "", favorite: true, colors: ["#eabb8b", "#512642"] },
      { title: "Spirited Away", creator: "2001", year: "2025", image: "", favorite: true, colors: ["#9cc2b5", "#336e70"] },
      { title: "The Grand Budapest Hotel", creator: "2014", year: "2024", image: "", favorite: false, colors: ["#e8a8b9", "#865585"] },
    ],
  },
];

// Replace these example projects with your own work and add image or video paths.

export const PROJECTS = [
  {

    company: "Luma", year: "2024", role: "Product Design", org: "Creative Tools", with: ["Add teammate", "Add teammate"],

    mission: "Designing new features to help creators bring ideas to life.",

    body: ["Add a one-line summary of your role and what you shipped.", "Describe the process: research, concept exploration, prototypes, and working with engineers.", "Close with the outcome and anyone you want to thank."],

    hue: ["#c4b5fd", "#f9a8d4", "#fde68a"], video: "", image: "",

  },

  {

    company: "Google", year: "2023", role: "UX Research", org: "Add org", with: ["Add teammate"],

    mission: "Researching how people use products every day.",

    body: ["Add a one-line summary of your role and what you learned.", "Describe the methods you used and who you worked with.", "Close with the impact of the research."],

    hue: ["#93c5fd", "#a7f3d0", "#fde68a"], video: "", image: "",

  },

  {

    company: "UCLA Design Lab", year: "2022–23", role: "Design Lead", org: "UCLA", with: ["Add teammate"],

    mission: "Leading a student team to design for real clients.",

    body: ["Add a one-line summary of what the lab does.", "Describe how you led the team and what you shipped.", "Close with the outcome."],

    hue: ["#fdba74", "#f9a8d4", "#c4b5fd"], video: "", image: "",

  },

  {

    company: "Figma", year: "2022", role: "Community Ambassador", org: "Community", with: ["Add teammate"],

    mission: "Building community around design.",

    body: ["Add a one-line summary of the program.", "Describe events, workshops, or content you ran.", "Close with the impact."],

    hue: ["#f9a8d4", "#93c5fd", "#86efac"], video: "", image: "",

  },

];
