import { readdir, stat, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// Catch Cloudflare Pages upload limits before a deployment starts.
const output = new URL("../dist/", import.meta.url);
const outputPath = fileURLToPath(output);
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile()) files.push({ path, size: (await stat(path)).size });
  }
}
try {
  await walk(outputPath);
  await readFile(new URL("index.html", output), "utf8");
  await readFile(new URL("_headers", output), "utf8");
  const oversized = files.filter(file => file.size > 25 * 1024 * 1024);
  if (oversized.length) throw new Error(`Files exceed 25 MiB: ${oversized.map(file => relative(outputPath, file.path)).join(", ")}`);
  if (files.length > 20000) throw new Error(`The build contains ${files.length} files; the limit is 20,000.`);
  const largest = Math.max(...files.map(file => file.size));
  console.log(`Hosting checks passed: ${files.length} files; largest ${(largest / 1024 / 1024).toFixed(2)} MiB.`);
} catch (error) {
  console.error(`Hosting check failed: ${error.message}\nRun npm run build before checking the output.`);
  process.exitCode = 1;
}
