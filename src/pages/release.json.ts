import { version } from "../../package.json";
export function GET() {
  return new Response(
    JSON.stringify({
      sha: process.env.GITHUB_SHA ?? "local",
      version,
      builtAt: new Date().toISOString(),
      locales: ["en", "ko"],
      ads: "off",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
