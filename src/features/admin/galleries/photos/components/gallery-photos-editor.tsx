import { rectSortingStrategy } from "@dnd-kit/sortable";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { PhotoImageSource } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import { SortableList } from "@/features/admin/components/sortable-list";
import { GalleryPhotoTile } from "@/features/admin/galleries/photos/components/gallery-photo-tile";
import type { GalleryPhoto } from "@/features/admin/galleries/photos/components/gallery-photo-tile";
import { PhotoPickerDialog } from "@/features/admin/galleries/photos/components/photo-picker-dialog";
import { addGalleryPhotos } from "@/features/admin/galleries/photos/server/add-gallery-photos";
import { moveGalleryPhoto } from "@/features/admin/galleries/photos/server/move-gallery-photo";
import { removeGalleryPhoto } from "@/features/admin/galleries/photos/server/remove-gallery-photo";
import { setGalleryCover } from "@/features/admin/galleries/photos/server/set-gallery-cover";
import { updateGalleryPhoto } from "@/features/admin/galleries/photos/server/update-gallery-photo";
import type { Span } from "@/lib/gallery-layout";

export function GalleryPhotosEditor({
  galleryId,
  coverPhotoId,
  photos,
  library,
}: {
  galleryId: string;
  coverPhotoId: string | null;
  photos: GalleryPhoto[];
  library: (PhotoImageSource & { id: string })[];
}) {
  const router = useRouter();
  const [isPicking, setIsPicking] = useState(false);

  const inGallery = new Set(photos.map((photo) => photo.id));
  const pickable = library.filter((photo) => !inGallery.has(photo.id));

  const refresh = () => router.invalidate();

  const handleAdd = async (photoIds: string[]) => {
    await addGalleryPhotos({ data: { galleryId, photoIds } });
    await refresh();
  };

  const handleMove = async (move: { id: string; afterId: string | null }) => {
    await moveGalleryPhoto({ data: { galleryId, ...move } });
    await refresh();
  };

  const handleSpanChange = async (photoId: string, span: Span) => {
    await updateGalleryPhoto({ data: { galleryId, photoId, span } });
    await refresh();
  };

  const handleSetCover = async (photoId: string) => {
    await setGalleryCover({
      data: { galleryId, photoId: photoId === coverPhotoId ? null : photoId },
    });
    await refresh();
  };

  const handleRemove = async (photoId: string) => {
    await removeGalleryPhoto({ data: { galleryId, photoId } });
    await refresh();
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Photos</h2>
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
          No photos in this gallery yet. Add some from the library.
        </p>
      ) : (
        <SortableList
          items={photos}
          strategy={rectSortingStrategy}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          onMove={handleMove}
          renderItem={(photo, handle) => (
            <GalleryPhotoTile
              photo={photo}
              handle={handle}
              isCover={photo.id === coverPhotoId}
              onSpanChange={(span) => handleSpanChange(photo.id, span)}
              onSetCover={() => handleSetCover(photo.id)}
              onRemove={() => handleRemove(photo.id)}
            />
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
    </section>
  );
}
