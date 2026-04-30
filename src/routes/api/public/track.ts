import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Body = z.object({
  path: z.string().min(1).max(512),
  referrer: z.string().max(1024).optional().nullable(),
});

function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    "0.0.0.0"
  );
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

async function enrichLocation(
  ip: string,
): Promise<{ region?: string; city?: string; country?: string }> {
  if (!ip || ip === "0.0.0.0" || ip.startsWith("127.") || ip.startsWith("::"))
    return {};
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      signal: ctrl.signal,
      headers: { "User-Agent": "trainings.live/analytics" },
    });
    clearTimeout(t);
    if (!res.ok) return {};
    const j = (await res.json()) as {
      region?: string;
      city?: string;
      country_code?: string;
    };
    return {
      region: j.region || undefined,
      city: j.city || undefined,
      country: j.country_code || undefined,
    };
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response(null, { status: 204 });
        }
        const parsed = Body.safeParse(json);
        if (!parsed.success) return new Response(null, { status: 204 });

        const { path, referrer } = parsed.data;
        if (path.startsWith("/admin") || path.startsWith("/api"))
          return new Response(null, { status: 204 });

        const ua = request.headers.get("user-agent") || "";
        // Filter common bots — keep DB clean
        if (/bot|crawler|spider|preview|monitor|fetch|axios|curl/i.test(ua))
          return new Response(null, { status: 204 });

        const ip = getClientIp(request);
        const country = request.headers.get("cf-ipcountry") || undefined;

        const visitor_hash = createHash("sha256")
          .update(`${ip}|${ua}|${todayUtc()}`)
          .digest("hex");

        let referrer_host: string | null = null;
        if (referrer) {
          try {
            referrer_host = new URL(referrer).host;
          } catch {
            referrer_host = null;
          }
        }

        const enriched = await enrichLocation(ip);

        const { error } = await supabaseAdmin.from("page_views").insert({
          path,
          referrer: referrer || null,
          referrer_host,
          country: enriched.country || country || null,
          region: enriched.region || null,
          city: enriched.city || null,
          visitor_hash,
          user_agent: ua.slice(0, 500),
        });
        if (error) console.error("page_views insert failed", error);

        return new Response(null, { status: 204 });
      },
    },
  },
});
