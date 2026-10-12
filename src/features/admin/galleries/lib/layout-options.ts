import type { Layout, Span } from "@/lib/gallery-layout";

export const LAYOUT_OPTIONS: Record<
  Layout,
  { label: string; description: string }
> = {
  grid: { label: "Grid", description: "Square tiles in even rows." },
  masonry: {
    label: "Masonry",
    description: "Columns that keep each photo's shape.",
  },
  column: {
    label: "Single column",
    description: "One large photo after another.",
  },
};

export const SPAN_OPTIONS: Record<Span, { label: string }> = {
  normal: { label: "Normal" },
  wide: { label: "Wide" },
  full: { label: "Full width" },
};
