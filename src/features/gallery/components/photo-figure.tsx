import { PhotoImage } from "@/components/photo-image";
import type { GalleryLayoutPhoto } from "@/features/gallery/lib/gallery-layout-props";
import { cn } from "@/lib/utils";

export function PhotoFigure({
  photo,
  sizes,
  className,
  imageClassName,
}: {
  photo: GalleryLayoutPhoto;
  sizes: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <PhotoImage photo={photo} sizes={sizes} className={imageClassName} />
      {photo.caption && (
        <figcaption className="text-muted-foreground text-sm">
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
