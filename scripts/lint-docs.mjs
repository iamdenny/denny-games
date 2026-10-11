import fs from "node:fs";
import { lint } from "markdownlint/promise";
import { walk } from "./check-docs.mjs";
const config = JSON.parse(
  fs.readFileSync(".markdownlint-cli2.jsonc", "utf8"),
).config;
const files = [
  "README.md",
  "AGENTS.md",
  "DESIGN.md",
  ...walk("docs").filter(
    (f) => f.endsWith(".md") && !f.endsWith("product/PRD.md"),
  ),
];
const result = await lint({ files, config });
const text = Object.entries(result)
  .flatMap(([file, errors]) =>
    errors.map(
      (e) =>
        `${file}:${e.lineNumber} ${e.ruleNames[0]} ${e.ruleDescription} ${e.errorDetail ?? ""}`,
    ),
  )
  .join("\n");
if (text) {
  console.error(text);
  process.exitCode = 1;
} else console.log(`Markdown: ${files.length} files passed`);
