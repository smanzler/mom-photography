import { rectSortingStrategy } from "@dnd-kit/sortable";
import { useRouter } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import { PhotoPickerDialog } from "@/features/admin/components/photo-picker-dialog";
import { SortableList } from "@/features/admin/components/sortable-list";
import { addHomepagePhotos } from "@/features/admin/homepage/server/add-homepage-photos";
import { moveHomepagePhoto } from "@/features/admin/homepage/server/move-homepage-photo";
import { removeHomepagePhoto } from "@/features/admin/homepage/server/remove-homepage-photo";

type HomepagePhoto = PhotoImageSource & { id: string };

export function HomepageScreen({
  photos,
  library,
}: {
  photos: HomepagePhoto[];
  library: HomepagePhoto[];
}) {
  const router = useRouter();
  const [isPicking, setIsPicking] = useState(false);

  const onHomepage = new Set(photos.map((photo) => photo.id));
  const pickable = library.filter((photo) => !onHomepage.has(photo.id));

  const refresh = () => router.invalidate();

  const handleAdd = async (photoIds: string[]) => {
    await addHomepagePhotos({ data: { photoIds } });
    await refresh();
  };

  const handleMove = async (move: { id: string; afterId: string | null }) => {
    await moveHomepagePhoto({ data: move });
    await refresh();
  };

  const handleRemove = async (photoId: string) => {
    await removeHomepagePhoto({ data: { photoId } });
    await refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Homepage</h1>
          <p className="text-muted-foreground text-sm">
            These photos play full-screen at the top of the homepage, in this
            order.
          </p>
        </div>
        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => setIsPicking(true)}
        >
          <Plus />
          Add photos
        </Button>
      </div>

      {photos.length === 0 ? (
        <p className="text-muted-foreground">
          No homepage photos yet. Add some from the library.
        </p>
      ) : (
        <SortableList
          items={photos}
          strategy={rectSortingStrategy}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          onMove={handleMove}
          renderItem={(photo, handle) => (
            <div className="border-border bg-background flex flex-col gap-2 rounded-md border p-2">
              <div className="aspect-[3/2] overflow-hidden rounded">
                <PhotoImage
                  photo={photo}
                  sizes="(min-width: 1024px) 18rem, 45vw"
                  className="h-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                {handle}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove from homepage"
                  onClick={() => handleRemove(photo.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          )}
        />
      )}

      {isPicking && (
        <PhotoPickerDialog
          photos={pickable}
          onPick={handleAdd}
          onClose={() => setIsPicking(false)}
        />
      )}
    </div>
  );
}
