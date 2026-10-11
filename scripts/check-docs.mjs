import fs from "node:fs";
import path from "node:path";
export function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(dir, entry.name))
        : [path.join(dir, entry.name)],
    );
}
const files = [
  "README.md",
  "AGENTS.md",
  "DESIGN.md",
  ...walk("docs").filter((f) => f.endsWith(".md")),
];
let errors = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (
    !["README.md", "AGENTS.md", "DESIGN.md"].includes(path.basename(file)) &&
    !file.endsWith("codemap.md")
  ) {
    const header = text.match(/^---\n([\s\S]+?)\n---/);
    for (const key of ["title", "summary", "read_when"])
      if (!header?.[1].includes(`${key}:`)) {
        console.error(`${file}: missing ${key}`);
        errors++;
      }
  }
  for (const match of text.matchAll(/\]\(([^)]+)\)/g)) {
    const link = match[1].split("#")[0];
    if (!link || /^[a-z]+:|^\//i.test(link)) continue;
    const target = path.resolve(path.dirname(file), decodeURI(link));
    if (!fs.existsSync(target)) {
      console.error(`${file}: broken link ${link}`);
      errors++;
    }
  }
}
console.log(`Documentation: ${files.length} files, ${errors} errors`);
if (errors) process.exitCode = 1;
