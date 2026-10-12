import { Link } from "@tanstack/react-router";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";

export function GalleryCard({
  gallery,
}: {
  gallery: { slug: string; title: string; coverPhoto: PhotoImageSource | null };
}) {
  return (
    <Link
      to="/$gallerySlug"
      params={{ gallerySlug: gallery.slug }}
      className="group flex flex-col gap-3"
    >
      <div className="bg-muted aspect-[4/5] overflow-hidden">
        {gallery.coverPhoto && (
          <PhotoImage
            photo={gallery.coverPhoto}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <h2 className="text-lg font-medium tracking-tight">{gallery.title}</h2>
    </Link>
  );
}
