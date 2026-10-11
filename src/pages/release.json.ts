export function GET() {
  return new Response(
    JSON.stringify({
      sha: process.env.GITHUB_SHA ?? "local",
      version: "0.1.0",
      builtAt: new Date().toISOString(),
      locales: ["en", "ko"],
      ads: "off",
    }),
    { headers: { "Content-Type": "application/json" } },
  );
}
