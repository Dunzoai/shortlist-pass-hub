import type { MetadataRoute } from "next";

const PRIVATE = ["/admin", "/portal", "/api", "/auth", "/classic"];
// AI crawlers and agents are welcome on the public site; the private areas stay private for everyone.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "meta-externalagent"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE },
    ],
    sitemap: "https://www.shortlistpass.com/sitemap.xml",
    host: "https://www.shortlistpass.com",
  };
}
