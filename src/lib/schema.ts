// JSON-LD schema builders for AEO (Answer Engine Optimization).
// All builders return plain objects you stringify into <script type="application/ld+json">.

import { SITE_URL, SITE_NAME, absoluteUrl } from "./seo";

const PROVIDER = {
  "@type": "EducationalOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  sameAs: [] as string[],
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "EducationalOrganization", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "AI Mastery Academy Africa",
        url: SITE_URL,
        logo: `${SITE_URL}/icon-512.png`,
        description:
          "Practical AI training for entrepreneurs, job seekers, content creators, professionals and freelancers. Live cohorts based in Nigeria, serving learners across Africa and globally online.",
        areaServed: ["Nigeria", "Africa", "Worldwide"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Lagos",
          addressCountry: "NG",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: "+234-705-426-5401",
            availableLanguage: ["English"],
            areaServed: "Worldwide",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export interface CourseInput {
  name: string;
  description: string;
  path: string;
  audience?: string;
  startDate?: string; // ISO
  endDate?: string;
  mode?: "online" | "onsite" | "blended";
  location?: string;
  priceLabel?: string;
  priceCurrency?: string;
  priceAmount?: string;
}

export function courseSchema(c: CourseInput) {
  const instance: Record<string, unknown> = {
    "@type": "CourseInstance",
    courseMode: c.mode ?? "online",
  };
  if (c.startDate) instance.startDate = c.startDate;
  if (c.endDate) instance.endDate = c.endDate;
  if (c.location) instance.location = c.location;

  const offers: Record<string, unknown> | undefined =
    c.priceAmount && c.priceCurrency
      ? {
          "@type": "Offer",
          price: c.priceAmount,
          priceCurrency: c.priceCurrency,
          url: absoluteUrl(c.path),
          availability: "https://schema.org/InStock",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.name,
    description: c.description,
    url: absoluteUrl(c.path),
    provider: PROVIDER,
    audience: c.audience
      ? { "@type": "EducationalAudience", audienceType: c.audience }
      : undefined,
    hasCourseInstance: instance,
    ...(offers ? { offers } : {}),
  };
}

export function eventSchema(e: {
  name: string;
  description: string;
  path: string;
  startDate: string;
  endDate: string;
  location?: string;
  priceAmount?: string;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    description: e.description,
    url: absoluteUrl(e.path),
    startDate: e.startDate,
    endDate: e.endDate,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: e.location ?? absoluteUrl(e.path),
    },
    organizer: PROVIDER,
    ...(e.priceAmount && e.priceCurrency
      ? {
          offers: {
            "@type": "Offer",
            price: e.priceAmount,
            priceCurrency: e.priceCurrency,
            url: absoluteUrl(e.path),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };
}

/** Build a TanStack Start `scripts` entry for JSON-LD. */
export function jsonLdScript(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}
