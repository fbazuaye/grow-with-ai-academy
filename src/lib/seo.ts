// Centralized SEO helpers for AEO/GEO/AIO optimization.
// Builds consistent <title>, description, canonical, OG and Twitter tags.

export const SITE_URL = "https://grow-with-ai-academy.lovable.app";
export const SITE_NAME = "AI Mastery Academy";
export const DEFAULT_OG_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4c653115-09d3-471a-ad71-c99ce863412b/id-preview-e207472e--5c9a347a-f105-4bee-87f8-dcd656e92871.lovable.app-1777328326440.png";

export interface BuildHeadOptions {
  title: string;
  description: string;
  /** Path beginning with "/" — used to build canonical & og:url */
  path: string;
  image?: string;
  /** og:type — defaults to "website" */
  type?: "website" | "article" | "course" | "event";
  /** Set true for /admin, /auth etc. */
  noindex?: boolean;
}

export function absoluteUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

export function buildHead(opts: BuildHeadOptions) {
  const { title, description, path, image = DEFAULT_OG_IMAGE, type = "website", noindex } = opts;
  const url = absoluteUrl(path);

  const meta: Array<{ title?: string; name?: string; property?: string; content?: string }> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type === "course" || type === "event" ? "website" : type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });

  const links = [{ rel: "canonical", href: url }];

  return { meta, links };
}
