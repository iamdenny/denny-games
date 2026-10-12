import { appendFileSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { KEY_PATH, runIndexNow } from "./indexnow.mjs";

const env = process.env;
const eventName = env.GITHUB_EVENT_NAME ?? "";
const runAttempt = env.GITHUB_RUN_ATTEMPT ?? "";
const beforeSha = env.INDEXNOW_BEFORE_SHA ?? "";
const headSha = env.GITHUB_SHA ?? "";

function summary(message) {
  if (env.GITHUB_STEP_SUMMARY) {
    appendFileSync(env.GITHUB_STEP_SUMMARY, `${message}\n`);
  }
}

function fail(message) {
  console.log(`::warning::${message}`);
  summary(`### IndexNow notification\n\nWarning: ${message}`);
  process.exitCode = 1;
}

let changedPaths = [];
const hasUsableBase =
  /^[a-f\d]{40,64}$/i.test(beforeSha) && !/^0+$/.test(beforeSha);
const hasUsableHead = /^[a-f\d]{40,64}$/i.test(headSha);
if (
  eventName === "push" &&
  runAttempt === "1" &&
  hasUsableBase &&
  hasUsableHead
) {
  const diff = spawnSync(
    "git",
    ["diff", "--name-only", "--no-renames", beforeSha, headSha],
    {
      encoding: "utf8",
    },
  );
  if (diff.error || diff.status !== 0) {
    fail("Could not read the push change list; no IndexNow request was sent.");
  } else {
    changedPaths = diff.stdout.split(/\r?\n/).filter(Boolean);
  }
}

if (process.exitCode !== 1) {
  let key = "";
  try {
    key = readFileSync(`public${KEY_PATH}`, "utf8").trim();
  } catch {
    fail("The checked-out IndexNow public key file is missing.");
  }
  if (process.exitCode !== 1) {
    const result = await runIndexNow({
      eventName,
      runAttempt,
      beforeSha,
      headSha,
      changedPaths,
      key,
    });
    if (result.status === "skipped") {
      console.log(`IndexNow skipped: ${result.reason}`);
      summary(`### IndexNow notification\n\nSkipped: ${result.reason}`);
    } else if (result.status === "failed") {
      fail(result.message);
    } else {
      const receipt =
        result.responseStatus === 202
          ? `HTTP 202 received; validation may still be pending for ${result.submittedUrlCount} sitemap URLs.`
          : `HTTP 200 received for ${result.submittedUrlCount} sitemap URLs.`;
      console.log(`IndexNow submission receipt: ${receipt}`);
      summary(
        `### IndexNow notification\n\nSubmission receipt: ${receipt} This does not verify crawling, indexing, ranking, traffic, or AI citations.`,
      );
    }
  }
}
