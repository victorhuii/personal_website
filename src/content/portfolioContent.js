// Replace these stock photographs with your own files in public/portfolio/.
// "large" gives a photo priority for the lead frame in an editorial spread.
// Width/height help avoid awkward crops; tone is an optional average RGB color.
// Add a category below, then use its id on any photo to include it in that filter.
export const PORTFOLIO = {
  title: "A little of\nwhat I see.",
  description: "People, places & passing moments.",
  credit: "A photographic journal by Victor Hui",
  heroImage: "/portfolio/lake.jpg",
  heroAlt: "The bow of a wooden boat on a quiet lake surrounded by forest and mountains",
};

export const PHOTO_CATEGORIES = [
  { id: "all", label: "All photographs" },
  { id: "people", label: "People" },
  { id: "places", label: "Places" },
  { id: "details", label: "Details" },
];

export const PORTFOLIO_PHOTOS = [
  { id: "lake", src: "/portfolio/lake.jpg", width: 1600, height: 1067, tone: [117, 117, 108], title: "Somewhere quiet", category: "places", size: "small", alt: "A wooden boat floating on a forest-lined mountain lake" },
  { id: "portrait-01", src: "/portfolio/portrait-01.jpg", width: 900, height: 1125, tone: [105, 109, 157], title: "In good company", category: "people", size: "small", alt: "A close-up portrait lit with blue and violet light", position: "50% 35%" },
  { id: "ocean", src: "/portfolio/ocean.jpg", width: 1000, height: 667, tone: [125, 152, 159], title: "The space between", category: "places", size: "small", alt: "Ocean waves and a distant horizon" },
  { id: "coffee", src: "/portfolio/coffee.jpg", width: 900, height: 600, tone: [97, 81, 65], title: "Slow mornings", category: "details", size: "small", alt: "A quiet moment with coffee" },
  { id: "portrait-02", src: "/portfolio/portrait-02.jpg", width: 900, height: 1350, tone: [40, 34, 28], title: "A familiar face", category: "people", size: "small", alt: "A close-up portrait against a dark background", position: "50% 30%" },
  { id: "forest", src: "/portfolio/forest.jpg", width: 1300, height: 866, tone: [69, 69, 51], title: "Where the light lands", category: "places", size: "large", alt: "Sunlight filtering through a dense green forest" },
  { id: "mountains", src: "/portfolio/mountains.jpg", width: 1000, height: 667, tone: [99, 94, 92], title: "A little further", category: "places", size: "small", alt: "A mountain landscape reflected in calm water" },
  { id: "architecture", src: "/portfolio/architecture.jpg", width: 1000, height: 667, tone: [197, 207, 213], title: "Lines & light", category: "details", size: "small", alt: "The clean lines of a white building" },
  { id: "portrait-03", src: "/portfolio/portrait-03.jpg", width: 900, height: 1350, tone: [99, 108, 115], title: "Just as you are", category: "people", size: "small", alt: "A smiling portrait against a soft grey background", position: "50% 30%" },
  { id: "mountain-haze", src: "/portfolio/mountain-haze.jpg", width: 1300, height: 1950, tone: [137, 138, 128], title: "Nothing in a hurry", category: "places", size: "large", alt: "Layers of green mountains fading into warm evening haze" },
  { id: "still-life", src: "/portfolio/still-life.jpg", width: 900, height: 603, tone: [170, 183, 172], title: "Everyday things", category: "details", size: "small", alt: "A black reading lamp against a pale green wall" },
  { id: "portrait-04", src: "/portfolio/portrait-04.jpg", width: 900, height: 1350, tone: [142, 140, 136], title: "An ordinary afternoon", category: "people", size: "small", alt: "A smiling portrait against a soft grey background", position: "50% 30%" },
  { id: "flowers", src: "/portfolio/flowers.jpg", width: 900, height: 600, tone: [108, 140, 104], title: "Small reasons", category: "details", size: "small", alt: "Delicate flowers in soft light" },
  { id: "leaves", src: "/portfolio/leaves.jpg", width: 900, height: 676, tone: [227, 232, 227], title: "A softer kind of green", category: "details", size: "small", alt: "Green leaves and gentle light" },
];
