// Original layout engine inspired by editorial photo spreads. No image loading,
// canvas processing or layout measurement is needed while the visitor scrolls.
const PATTERNS = {
  1: [[[1, 0, 10, 12]]],
  2: [[[0, 0, 7, 12], [7, 2, 5, 8]], [[0, 0, 12, 7], [2, 7, 8, 5]]],
  3: [
    [[0, 0, 7, 12], [7, 0, 5, 7], [7, 7, 5, 5]],
    [[0, 0, 12, 7], [0, 7, 7, 5], [7, 7, 5, 5]],
    [[0, 1, 4, 10], [4, 0, 4, 8], [8, 4, 4, 8]],
  ],
  4: [
    [[0, 0, 7, 8], [0, 8, 7, 4], [7, 0, 5, 5], [7, 5, 5, 7]],
    [[0, 0, 6, 12], [6, 0, 6, 5], [6, 5, 3, 7], [9, 5, 3, 7]],
    [[0, 0, 12, 7], [0, 7, 4, 5], [4, 7, 4, 5], [8, 7, 4, 5]],
    [[0, 0, 6, 6], [6, 0, 6, 6], [0, 6, 6, 6], [6, 6, 6, 6]],
  ],
  5: [
    [[0, 0, 5, 12], [5, 0, 4, 7], [5, 7, 4, 5], [9, 0, 3, 5], [9, 5, 3, 7]],
    [[0, 0, 8, 7], [8, 0, 4, 7], [0, 7, 4, 5], [4, 7, 4, 5], [8, 7, 4, 5]],
    [[0, 0, 4, 8], [0, 8, 4, 4], [4, 0, 4, 5], [4, 5, 4, 7], [8, 1, 4, 10]],
    [[0, 0, 6, 5], [6, 0, 6, 5], [0, 7, 4, 4], [4, 7, 4, 4], [8, 7, 4, 4]],
  ],
};

function permutations(items) {
  if (items.length <= 1) return [items];
  return items.flatMap((item, index) => permutations(items.filter((_, i) => i !== index))
    .map(rest => [item, ...rest]));
}

function rateArrangement(photos, frames, ratio) {
  const areas = frames.map(frame => frame.width * frame.height);
  const totalArea = areas.reduce((sum, area) => sum + area, 0);
  const largest = Math.max(...areas);
  let score = 0;
  let worstCrop = 1;
  let centerX = 0;
  let centerY = 0;
  let totalWeight = 0;
  photos.forEach((photo, index) => {
    const frame = frames[index];
    const originalRatio = photo.width && photo.height ? photo.width / photo.height : 1.5;
    const frameRatio = frame.width * ratio / frame.height;
    const retained = Math.min(frameRatio / originalRatio, originalRatio / frameRatio);
    worstCrop = Math.min(worstCrop, retained);
    score += retained * (0.35 / photos.length + 0.65 * areas[index] / totalArea);
    if (photo.size === "large") score += 0.045 * areas[index] / largest;
    const tone = photo.tone ?? [128, 128, 128];
    const brightness = (tone[0] * 0.21 + tone[1] * 0.72 + tone[2] * 0.07) / 255;
    const weight = areas[index] * (1.4 - brightness * 0.6);
    centerX += (frame.x + frame.width / 2) * weight;
    centerY += (frame.y + frame.height / 2) * weight;
    totalWeight += weight;
    for (let j = 0; j < index; j += 1) {
      const other = frames[j];
      const distance = Math.hypot(frame.x + frame.width / 2 - other.x - other.width / 2,
        frame.y + frame.height / 2 - other.y - other.height / 2);
      if (distance < 0.65) {
        const otherTone = photos[j].tone ?? [128, 128, 128];
        const difference = Math.hypot(...tone.map((value, channel) => value - otherTone[channel])) / 442;
        score -= difference * 0.025 / photos.length;
      }
    }
  });
  // Protect the worst crop and avoid concentrating all the dark photos on one side.
  return score + worstCrop * 0.3 - Math.hypot(centerX / totalWeight - 0.5, centerY / totalWeight - 0.5) * 0.12;
}

function arrange(photos, ratio, seed) {
  const orders = permutations(photos);
  const candidates = [];
  PATTERNS[photos.length].forEach((pattern, patternIndex) => {
    for (const mirror of [false, true]) {
      const frames = pattern.map(([x, y, width, height]) => ({
        x: (mirror ? 12 - x - width : x) / 12, y: y / 12,
        width: width / 12, height: height / 12,
      }));
      orders.forEach(order => candidates.push({
        pattern: patternIndex, order, frames,
        score: rateArrangement(order, frames, ratio),
      }));
    }
  });
  candidates.sort((a, b) => b.score - a.score);
  const bestScore = candidates[0].score;
  const choices = [];
  const seen = new Set();
  // Keep several compositions available, while rejecting heavily cropped alternatives.
  for (const candidate of candidates) {
    if (candidate.score < bestScore - 0.09 || choices.length >= 24) break;
    const signature = candidate.order.map((photo, i) => `${photo.id}:${JSON.stringify(candidate.frames[i])}`).join("|");
    if (!seen.has(signature)) { seen.add(signature); choices.push(candidate); }
  }
  const chosen = choices[((seed % choices.length) + choices.length) % choices.length];
  return Object.fromEntries(chosen.order.map((photo, index) => [photo.id, chosen.frames[index]]));
}

export function createPhotoSpreads(photos, seed = 0) {
  if (!photos.length) return [];
  const count = Math.ceil(photos.length / 5);
  const base = Math.floor(photos.length / count);
  const remainder = photos.length % count;
  let offset = 0;
  return Array.from({ length: count }, (_, index) => {
    const group = photos.slice(offset, offset + base + (index < remainder ? 1 : 0));
    offset += group.length;
    const portraits = group.filter(photo => photo.width && photo.height && photo.width < photo.height).length;
    const ratio = portraits > group.length / 2 ? 0.95 : 1.32;
    const desktop = arrange(group, ratio, seed + index * 5);
    const mobile = arrange(group, 0.85, seed + index * 5);
    return { id: group.map(photo => photo.id).join("-"), photos: group, desktop, mobile, ratio };
  });
}
