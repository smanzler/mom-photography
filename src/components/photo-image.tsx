import type { ComponentProps } from "react";
import { buildImageSrcSet, buildImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";

export type PhotoImageSource = {
  key: string;
  width: number;
  height: number;
  placeholder: string;
  alt: string;
};

/** `sizes` must match the rendered width, or the browser picks a wrong file from the srcset. */
export function PhotoImage({
  photo,
  sizes,
  className,
  ...props
}: { photo: PhotoImageSource; sizes: string } & Omit<
  ComponentProps<"img">,
  "src" | "srcSet" | "width" | "height" | "alt"
>) {
  return (
    <img
      src={buildImageUrl({
        key: photo.key,
        width: Math.min(photo.width, 1280),
      })}
      srcSet={buildImageSrcSet({ key: photo.key, width: photo.width })}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      loading="lazy"
      decoding="async"
      // Tailwind cannot take a data URL from a runtime value.
      style={{ backgroundImage: `url(${photo.placeholder})` }}
      className={cn("h-auto w-full bg-cover bg-center", className)}
      {...props}
    />
  );
}
