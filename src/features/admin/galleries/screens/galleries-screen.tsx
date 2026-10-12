import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Link, useRouter } from "@tanstack/react-router";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { Badge } from "@/components/ui/badge";
import { SortableList } from "@/features/admin/components/sortable-list";
import { NewGalleryForm } from "@/features/admin/galleries/components/new-gallery-form";
import { moveGallery } from "@/features/admin/galleries/server/move-gallery";

export type GalleryListItem = {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
  coverPhoto: PhotoImageSource | null;
};

export function GalleriesScreen({
  galleries,
}: {
  galleries: GalleryListItem[];
}) {
  const router = useRouter();

  const handleMove = async (move: { id: string; afterId: string | null }) => {
    await moveGallery({ data: move });
    await router.invalidate();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Galleries</h1>
        <div className="sm:ml-auto sm:w-80">
          <NewGalleryForm />
        </div>
      </div>

      {galleries.length === 0 ? (
        <p className="text-muted-foreground">No galleries yet.</p>
      ) : (
        <SortableList
          items={galleries}
          strategy={verticalListSortingStrategy}
          className="divide-border border-border flex flex-col divide-y rounded-md border"
          onMove={handleMove}
          renderItem={(gallery, handle) => (
            <div className="bg-background flex items-center gap-3 p-3">
              {handle}
              <div className="bg-muted size-12 shrink-0 overflow-hidden rounded">
                {gallery.coverPhoto && (
                  <PhotoImage
                    photo={gallery.coverPhoto}
                    sizes="3rem"
                    className="h-full object-cover"
                  />
                )}
              </div>
              <Link
                to="/admin/galleries/$galleryId"
                params={{ galleryId: gallery.id }}
                className="font-medium hover:underline"
              >
                {gallery.title}
              </Link>
              <span className="text-muted-foreground text-sm">
                /{gallery.slug}
              </span>
              <Badge
                variant={gallery.publishedAt ? "default" : "outline"}
                className="ml-auto"
              >
                {gallery.publishedAt ? "Published" : "Draft"}
              </Badge>
            </div>
          )}
        />
      )}
    </div>
  );
}
