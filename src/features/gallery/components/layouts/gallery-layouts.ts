import type { ComponentType } from "react";
import { ColumnLayout } from "@/features/gallery/components/layouts/column-layout";
import { GridLayout } from "@/features/gallery/components/layouts/grid-layout";
import { MasonryLayout } from "@/features/gallery/components/layouts/masonry-layout";
import type { GalleryLayoutProps } from "@/features/gallery/lib/gallery-layout-props";
import type { Layout } from "@/lib/gallery-layout";

export const GALLERY_LAYOUTS: Record<
  Layout,
  ComponentType<GalleryLayoutProps>
> = {
  grid: GridLayout,
  masonry: MasonryLayout,
  column: ColumnLayout,
};
