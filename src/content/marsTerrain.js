const repository = "https://github.com/victorhuii/Mars-Rover-Terrain-Segmentation";

export const MARS_TERRAIN = {
  id: "mars-terrain",
  title: "Mars Rover Terrain Segmentation",
  subtitle: "65.8% mean IoU on the frozen expert test.",
  route: "#/projects/mars-terrain",
  description: "Trained a model to identify soil, bedrock, sand and large rocks in Mars rover images. Built a React app that runs predictions in the browser, with image uploads, terrain overlays and downloadable results.",
  stack: ["Computer Vision", "PyTorch", "React", "TypeScript", "ONNX"],
  links: [
    { label: "Live demo", href: "https://mars-rover-terrain-segmentation.pages.dev/" },
    { label: "GitHub", href: repository },
  ],
  dashboard: {
    src: "/projects/mars-terrain/terrain-result.png",
    width: 1320,
    height: 1614,
    alt: "Mars rover image beside a predicted terrain mask and colored overlay.",
  },
  attribution: "Rover imagery: NASA/JPL-Caltech; dataset: AI4Mars, Swan et al.",
  sources: {
    model: `${repository}/blob/main/docs/model_card.md`,
    experiments: `${repository}/blob/main/docs/experiments.md`,
    architecture: `${repository}/blob/main/docs/architecture.md`,
  },
};
