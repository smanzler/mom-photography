import type { PhotoImageSource } from "@/components/photo-image";
import { GalleryCard } from "@/features/gallery/components/gallery-card";
import { SiteLayout } from "@/features/site/components/site-layout";
import { SITE } from "@/lib/site";

export function HomeScreen({
  galleries,
}: {
  galleries: {
    id: string;
    slug: string;
    title: string;
    coverPhoto: PhotoImageSource | null;
  }[];
}) {
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-tight">{SITE.name}</h1>
          <p className="text-muted-foreground">{SITE.tagline}</p>
        </div>
        {galleries.length === 0 ? (
          <p className="text-muted-foreground">New work is on its way.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
