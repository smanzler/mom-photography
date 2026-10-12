import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { UpdateGalleryInput } from "@/features/admin/galleries/lib/gallery-schema";
import { LAYOUT_OPTIONS } from "@/features/admin/galleries/lib/layout-options";
import { updateGallery } from "@/features/admin/galleries/server/update-gallery";
import { LAYOUTS, layoutSchema } from "@/lib/gallery-layout";

const LAYOUT_ITEMS = LAYOUTS.map((layout) => ({
  value: layout,
  label: LAYOUT_OPTIONS[layout].label,
}));

export function GalleryDetailsForm({
  gallery,
}: {
  gallery: UpdateGalleryInput;
}) {
  const router = useRouter();
  const [values, setValues] = useState(gallery);
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  const setValue = <TKey extends keyof UpdateGalleryInput>(
    key: TKey,
    value: UpdateGalleryInput[TKey],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    setError(undefined);

    await updateGallery({ data: values })
      .then(() => router.invalidate())
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : "Could not save."),
      );
    setIsPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          required
          value={values.title}
          onChange={(event) => setValue("title", event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="slug">URL</Label>
        <Input
          id="slug"
          required
          value={values.slug}
          onChange={(event) => setValue("slug", event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={values.description ?? ""}
          onChange={(event) =>
            setValue("description", event.target.value || null)
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="layout">Layout</Label>
        <Select
          items={LAYOUT_ITEMS}
          value={values.layout}
          onValueChange={(value) =>
            setValue("layout", layoutSchema.parse(value))
          }
        >
          <SelectTrigger id="layout" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUT_ITEMS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-sm">
          {LAYOUT_OPTIONS[values.layout].description}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={values.isPublished}
          onCheckedChange={(checked) => setValue("isPublished", checked)}
        />
        <Label htmlFor="published">Published</Label>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
