import assert from "node:assert/strict";
import test from "node:test";
import { createPhotoSpreads } from "./photoSpreads.js";
import { PORTFOLIO_PHOTOS, PHOTO_CATEGORIES } from "../content/portfolioContent.js";

function verifySpread(spread) {
  for (const layout of [spread.desktop, spread.mobile]) {
    assert.deepEqual(Object.keys(layout).sort(), spread.photos.map(photo => photo.id).sort());
    const frames = Object.values(layout);
    frames.forEach(frame => {
      assert.ok(frame.width > 0 && frame.height > 0);
      assert.ok(frame.x >= 0 && frame.y >= 0);
      assert.ok(frame.x + frame.width <= 1.00001 && frame.y + frame.height <= 1.00001);
    });
    for (let i = 0; i < frames.length; i += 1) {
      for (let j = 0; j < i; j += 1) {
        const a = frames[i]; const b = frames[j];
        const overlapX = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
        assert.ok(overlapX <= 0.00001 || overlapY <= 0.00001, "Photo frames must not overlap");
      }
    }
  }
}

test("all category filters preserve every photo exactly once across variations", () => {
  for (const category of PHOTO_CATEGORIES) {
    const photos = PORTFOLIO_PHOTOS.filter(photo => category.id === "all" || photo.category === category.id);
    for (let seed = 0; seed < 12; seed += 1) {
      const spreads = createPhotoSpreads(photos, seed);
      assert.deepEqual(spreads.flatMap(spread => spread.photos.map(photo => photo.id)), photos.map(photo => photo.id));
      spreads.forEach(verifySpread);
    }
  }
});

test("empty, single, two-photo and growing collections remain valid without metadata", () => {
  assert.deepEqual(createPhotoSpreads([]), []);
  for (let length = 1; length <= 21; length += 1) {
    const photos = Array.from({ length }, (_, id) => ({ id: `new-${id}` }));
    const spreads = createPhotoSpreads(photos);
    spreads.forEach(verifySpread);
    assert.equal(spreads.flatMap(spread => spread.photos).length, length);
    assert.ok(spreads.every(spread => spread.photos.length <= 5));
  }
});

test("the same seed is stable and Rearrange offers a different arrangement", () => {
  assert.deepEqual(createPhotoSpreads(PORTFOLIO_PHOTOS, 3), createPhotoSpreads(PORTFOLIO_PHOTOS, 3));
  assert.notDeepEqual(createPhotoSpreads(PORTFOLIO_PHOTOS, 0)[0].desktop, createPhotoSpreads(PORTFOLIO_PHOTOS, 1)[0].desktop);
});

test("portrait-only sets get a taller page and avoid severe default crops", () => {
  const portraits = PORTFOLIO_PHOTOS.filter(photo => photo.category === "people");
  const [spread] = createPhotoSpreads(portraits);
  assert.ok(spread.ratio < 1);
  for (const photo of portraits) {
    const frame = spread.desktop[photo.id];
    const ratio = frame.width * spread.ratio / frame.height / (photo.width / photo.height);
    assert.ok(Math.min(ratio, 1 / ratio) > 0.65);
  }
});
