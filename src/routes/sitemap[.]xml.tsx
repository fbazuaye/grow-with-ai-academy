import { createFileRoute } from "@tanstack/react-router";
import { fetchPrograms } from "@/lib/programs";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const staticPaths = [
          "/",
          "/programs",
          "/about",
          "/faq",
          "/enquire",
          "/programs/ai-business-growth/curriculum",
          "/programs/ai-video-teens/curriculum",
          "/register/ai-business-growth",
          "/register/ai-video-teens",
        ];

        let programPaths: string[] = [];
        try {
          const programs = await fetchPrograms();
          programPaths = programs
            .filter((p) => p.slug !== "ai-business-growth") // redirected
            .map((p) => `/programs/${p.slug}`);
        } catch {
          // Sitemap should never crash; fall back to static paths.
        }

        const today = new Date().toISOString().slice(0, 10);
        const urls = [...staticPaths, ...programPaths]
          .map(
            (path) =>
              `  <url><loc>${SITE_URL}${path}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
