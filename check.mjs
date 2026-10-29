import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { basePath, outputDirectory } from "./config.mjs";
const root = fileURLToPath(outputDirectory);
let pages = 0,
  links = 0,
  errors = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) {
      walk(file);
      continue;
    }
    if (!name.endsWith(".html")) continue;
    pages++;
    const html = readFileSync(file, "utf8");
    for (const m of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)) {
      links++;
      if (m[1].startsWith("//")) continue;
      if (basePath && !m[1].startsWith(basePath + "/")) {
        errors.push(`${file}: link outside BASE_PATH: ${m[1]}`);
        continue;
      }
      let target = resolve(root, "." + m[1].slice(basePath.length));
      if (existsSync(target) && statSync(target).isDirectory()) target = join(target, "index.html");
      if (!existsSync(target)) errors.push(`${file}: missing ${m[1]}`);
    }
    for (const tag of ["<title>", 'name="description"', 'name="viewport"', "<h1>", 'id="main"'])
      if (!html.includes(tag)) errors.push(`${file}: missing ${tag}`);
  }
}
walk(root);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Checked ${pages} pages and ${links} internal links/assets. All resolve.`);
