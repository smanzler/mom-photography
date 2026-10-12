import { PhotoFigure } from "@/features/gallery/components/photo-figure";
import type { GalleryLayoutProps } from "@/features/gallery/lib/gallery-layout-props";

/** Keeps each photo's shape, so photo sizes do not apply. */
export function MasonryLayout({ photos }: GalleryLayoutProps) {
  return (
    <div className="columns-1 gap-2 sm:columns-2 lg:columns-3">
      {photos.map((photo) => (
        <PhotoFigure
          key={photo.id}
          photo={photo}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="mb-2 break-inside-avoid"
        />
      ))}
    </div>
  );
}
