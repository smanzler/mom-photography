import type { PhotoImageSource } from "@/components/photo-image";
import type { Span } from "@/lib/gallery-layout";

export type GalleryLayoutPhoto = PhotoImageSource & {
  id: string;
  caption: string | null;
  span: Span;
};

export type GalleryLayoutProps = {
  photos: GalleryLayoutPhoto[];
  onOpen: (index: number) => void;
};
