import { Star, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPAN_OPTIONS } from "@/features/admin/galleries/lib/layout-options";
import { SPANS, spanSchema } from "@/lib/gallery-layout";
import type { Span } from "@/lib/gallery-layout";

export type GalleryPhoto = PhotoImageSource & { id: string; span: Span };

const SPAN_ITEMS = SPANS.map((span) => ({
  value: span,
  label: SPAN_OPTIONS[span].label,
}));

export function GalleryPhotoTile({
  photo,
  handle,
  isCover,
  onSpanChange,
  onSetCover,
  onRemove,
}: {
  photo: GalleryPhoto;
  handle: ReactNode;
  isCover: boolean;
  onSpanChange: (span: Span) => void;
  onSetCover: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="border-border bg-background flex flex-col gap-2 rounded-md border p-2">
      <div className="aspect-square overflow-hidden rounded">
        <PhotoImage
          photo={photo}
          sizes="(min-width: 1024px) 14rem, 45vw"
          className="h-full object-cover"
        />
      </div>
      <div className="flex items-center gap-1">
        {handle}
        <Select
          items={SPAN_ITEMS}
          value={photo.span}
          onValueChange={(value) => onSpanChange(spanSchema.parse(value))}
        >
          <SelectTrigger size="sm" className="min-w-0 flex-1" aria-label="Size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SPAN_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={isCover ? "Cover photo" : "Use as cover"}
          aria-pressed={isCover}
          onClick={onSetCover}
        >
          <Star className={isCover ? "fill-current" : undefined} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Remove from gallery"
          onClick={onRemove}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
