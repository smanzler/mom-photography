import { GALLERY_LAYOUTS } from "@/features/gallery/components/layouts/gallery-layouts";
import type { GalleryLayoutPhoto } from "@/features/gallery/lib/gallery-layout-props";
import { SiteLayout } from "@/features/site/components/site-layout";
import type { Layout } from "@/lib/gallery-layout";

export function GalleryScreen({
  gallery,
}: {
  gallery: {
    title: string;
    description: string | null;
    layout: Layout;
    photos: GalleryLayoutPhoto[];
  };
}) {
  const GalleryLayout = GALLERY_LAYOUTS[gallery.layout];

  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            {gallery.title}
          </h1>
          {gallery.description && (
            <p className="text-muted-foreground whitespace-pre-line">
              {gallery.description}
            </p>
          )}
        </div>
        <GalleryLayout photos={gallery.photos} />
      </div>
    </SiteLayout>
  );
}
