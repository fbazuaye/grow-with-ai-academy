import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SITE_URL } from "@/lib/seo";

const INDEXNOW_KEY = "a5c97f9d949a0084c23fe755e21a334c";
const HOST = new URL(SITE_URL).host;

const Body = z.object({
  urls: z
    .array(z.string().url().max(500))
    .min(1)
    .max(50)
    .refine((arr) => arr.every((u) => u.startsWith(SITE_URL)), {
      message: `All URLs must begin with ${SITE_URL}`,
    }),
});

export const Route = createFileRoute("/api/public/indexnow-ping")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Body.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.errors[0]?.message ?? "Invalid input" },
            { status: 400 },
          );
        }

        const payload = {
          host: HOST,
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: parsed.data.urls,
        };

        try {
          const res = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(payload),
          });
          return Response.json(
            { ok: res.ok, status: res.status, submitted: parsed.data.urls.length },
            { status: res.ok ? 200 : 502 },
          );
        } catch (err) {
          console.error("IndexNow ping failed:", err);
          return Response.json(
            { ok: false, error: "IndexNow request failed" },
            { status: 502 },
          );
        }
      },
    },
  },
});
