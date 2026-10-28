import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve("dist");
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
      let target = join(root, m[1]);
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
