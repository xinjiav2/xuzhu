import { readdirSync, mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { outputDirectory } from "./config.mjs";

// Checked-in HTML lets Pages publish directly from main / (root).
const root = fileURLToPath(new URL("./", import.meta.url));
const source = fileURLToPath(outputDirectory);

function publish(directory, relative = "") {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(relative, entry.name);
    if (entry.isDirectory()) {
      publish(join(directory, entry.name), path);
      continue;
    }
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(directory, entry.name), destination);
  }
}
publish(source);
writeFileSync(join(root, ".nojekyll"), "");
console.log("Prepared repository root for GitHub Pages branch deployment.");
