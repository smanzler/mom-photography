import { PhotoFigure } from "@/features/gallery/components/photo-figure";
import type { GalleryLayoutProps } from "@/features/gallery/lib/gallery-layout-props";
import type { Span } from "@/lib/gallery-layout";

const SPAN_STYLES: Record<
  Span,
  { cell: string; image: string; sizes: string }
> = {
  normal: {
    cell: "",
    image: "aspect-square",
    sizes: "(min-width: 768px) 33vw, 50vw",
  },
  wide: {
    cell: "col-span-2",
    image: "aspect-[2/1]",
    sizes: "(min-width: 768px) 66vw, 100vw",
  },
  full: {
    cell: "col-span-full",
    image: "aspect-[21/9]",
    sizes: "100vw",
  },
};

export function GridLayout({ photos }: GalleryLayoutProps) {
  return (
    <div className="grid grid-flow-dense grid-cols-2 gap-2 md:grid-cols-3">
      {photos.map((photo) => {
        const style = SPAN_STYLES[photo.span];
        return (
          <PhotoFigure
            key={photo.id}
            photo={photo}
            sizes={style.sizes}
            className={style.cell}
            imageClassName={`${style.image} object-cover`}
          />
        );
      })}
    </div>
  );
}
