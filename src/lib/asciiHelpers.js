export const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

export const mix = (a, b, t) =>
  a + (b - a) * t;

export function seededRandom(seed = 1337) {
  let value = seed >>> 0;

  return () => {
    value =
      (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function createGrid(width, height) {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({
      char: " ",
      z: -Infinity,
    }))
  );
}

export function put(
  grid,
  x,
  y,
  char,
  z = 0
) {
  const ix = Math.round(x);
  const iy = Math.round(y);

  if (
    iy < 0 ||
    iy >= grid.length ||
    ix < 0 ||
    ix >= grid[0].length
  ) {
    return;
  }

  if (z >= grid[iy][ix].z) {
    grid[iy][ix] = { char, z };
  }
}

export function gridToString(grid) {
  return grid
    .map((row) => row.map((cell) => cell.char).join(""))
    .join("\n");
}

export function line(
  grid,
  x1,
  y1,
  x2,
  y2,
  char,
  z = 0
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const steps = Math.max(
    Math.abs(dx),
    Math.abs(dy),
    1
  );

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    put(
      grid,
      mix(x1, x2, t),
      mix(y1, y2, t),
      char,
      z
    );
  }
}

export function ellipse(
  grid,
  cx,
  cy,
  rx,
  ry,
  char,
  z = 0,
  step = 0.08
) {
  for (
    let t = 0;
    t < Math.PI * 2;
    t += step
  ) {
    put(
      grid,
      cx + Math.cos(t) * rx,
      cy + Math.sin(t) * ry,
      char,
      z
    );
  }
}

export function fillEllipse(
  grid,
  cx,
  cy,
  rx,
  ry,
  chars,
  z = 0
) {
  const palette =
    typeof chars === "string"
      ? chars
      : "@#xo:.";

  for (
    let y = Math.floor(cy - ry);
    y <= Math.ceil(cy + ry);
    y++
  ) {
    for (
      let x = Math.floor(cx - rx);
      x <= Math.ceil(cx + rx);
      x++
    ) {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      const d = nx * nx + ny * ny;

      if (d > 1) continue;

      const shade = Math.sqrt(
        Math.max(0, 1 - d)
      );

      const index = Math.floor(
        clamp(
          (1 - shade) *
            (palette.length - 1),
          0,
          palette.length - 1
        )
      );

      put(
        grid,
        x,
        y,
        palette[index],
        z + shade
      );
    }
  }
}

export function text(
  grid,
  x,
  y,
  value,
  z = 0
) {
  for (let i = 0; i < value.length; i++) {
    put(grid, x + i, y, value[i], z);
  }
}