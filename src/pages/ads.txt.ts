import type { APIRoute } from "astro";
import { ads } from "../data/ads";
export const GET: APIRoute = () =>
  new Response(ads.sellers.join("\n") + (ads.sellers.length ? "\n" : ""), {
    headers: { "Content-Type": "text/plain" },
  });
