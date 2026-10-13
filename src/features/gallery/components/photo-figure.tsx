import { PhotoImage } from "@/components/photo-image";
import type { GalleryLayoutPhoto } from "@/features/gallery/lib/gallery-layout-props";
import { cn } from "@/lib/utils";

export function PhotoFigure({
  photo,
  sizes,
  className,
  imageClassName,
  onOpen,
}: {
  photo: GalleryLayoutPhoto;
  onOpen: () => void;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <button
        type="button"
        aria-label={photo.alt ? `Open photo: ${photo.alt}` : "Open photo"}
        className="focus-visible:ring-ring block cursor-zoom-in focus-visible:ring-2 focus-visible:outline-none"
        onClick={onOpen}
      >
        <PhotoImage photo={photo} sizes={sizes} className={imageClassName} />
      </button>
      {photo.caption && (
        <figcaption className="text-muted-foreground text-sm">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
