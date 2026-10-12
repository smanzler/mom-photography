import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/features/site/components/site-layout";
import { buildPageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
  head: () =>
    buildPageHead({
      title: `${SITE.name} — ${SITE.tagline}`,
      description: SITE.description,
      path: "/",
    }),
});

function Home() {
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-32 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{SITE.name}</h1>
        <p className="text-muted-foreground">{SITE.tagline}</p>
      </div>
    </SiteLayout>
  );
}
