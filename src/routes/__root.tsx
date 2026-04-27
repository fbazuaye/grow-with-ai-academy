import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-gradient-gold px-5 text-sm font-semibold text-navy shadow-gold"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#1b1f3a" },
      { title: "AI Mastery Academy — Learn AI to Grow, Earn & Work Smarter" },
      { name: "description", content: "Practical AI training for entrepreneurs, job seekers, creators, professionals & freelancers. Live cohorts, real outcomes." },
      { property: "og:title", content: "AI Mastery Academy — Learn AI to Grow, Earn & Work Smarter" },
      { property: "og:description", content: "Practical AI training for entrepreneurs, job seekers, creators, professionals & freelancers. Live cohorts, real outcomes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Mastery Academy — Learn AI to Grow, Earn & Work Smarter" },
      { name: "twitter:description", content: "Practical AI training for entrepreneurs, job seekers, creators, professionals & freelancers. Live cohorts, real outcomes." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4c653115-09d3-471a-ad71-c99ce863412b/id-preview-e207472e--5c9a347a-f105-4bee-87f8-dcd656e92871.lovable.app-1777328326440.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4c653115-09d3-471a-ad71-c99ce863412b/id-preview-e207472e--5c9a347a-f105-4bee-87f8-dcd656e92871.lovable.app-1777328326440.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}
