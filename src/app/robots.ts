import type { MetadataRoute } from "next";

const PRIVATE = ["/admin", "/portal", "/api", "/auth", "/classic"];
// AI crawlers and agents are welcome on the public site; the private areas stay private for everyone.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // Search engines: same rules as everyone else, stated explicitly so /rentals is clearly open to them.
      { userAgent: ["Googlebot", "Bingbot"], allow: ["/", "/rentals", "/rentals.md"], disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: ["/", "/AGENTS.md", "/llms.txt", "/llms-full.txt", "/agents", "/rentals", "/rentals.md"], disallow: PRIVATE },
    ],
    sitemap: "https://www.shortlistpass.com/sitemap.xml",
    host: "https://www.shortlistpass.com",
  };
}
