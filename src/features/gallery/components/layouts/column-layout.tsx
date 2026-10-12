import { PhotoFigure } from "@/features/gallery/components/photo-figure";
import type { GalleryLayoutProps } from "@/features/gallery/lib/gallery-layout-props";
import type { Span } from "@/lib/gallery-layout";

const SPAN_STYLES: Record<Span, { width: string; sizes: string }> = {
  normal: { width: "max-w-3xl", sizes: "(min-width: 768px) 48rem, 100vw" },
  wide: { width: "max-w-5xl", sizes: "(min-width: 1024px) 64rem, 100vw" },
  full: { width: "max-w-none", sizes: "100vw" },
};

export function ColumnLayout({ photos }: GalleryLayoutProps) {
  return (
    <div className="flex flex-col items-center gap-12">
      {photos.map((photo) => {
        const style = SPAN_STYLES[photo.span];
        return (
          <PhotoFigure
            key={photo.id}
            photo={photo}
            sizes={style.sizes}
            className={`w-full ${style.width}`}
          />
        );
      })}
    </div>
  );
}
