import { useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import { FileDropOverlay } from "@/features/admin/components/file-drop-overlay";
import { UploadButton } from "@/features/admin/components/upload-button";
import { UploadFailureList } from "@/features/admin/components/upload-failure-list";
import { useFileDrop } from "@/features/admin/hooks/use-file-drop";
import { useUploadPhotos } from "@/features/admin/hooks/use-upload-photos";
import { PhotoEditDialog } from "@/features/admin/photos/components/photo-edit-dialog";
import type { EditablePhoto } from "@/features/admin/photos/components/photo-edit-dialog";
import { deletePhotos } from "@/features/admin/photos/server/delete-photos";
import { cn } from "cn";

export function PhotosScreen({ photos }: { photos: EditablePhoto[] }) {
  const router = useRouter();
  const { uploadPhotos, progress, failures } = useUploadPhotos();
  const [editing, setEditing] = useState<EditablePhoto>();
  // Undefined while not in select mode.
  const [selected, setSelected] = useState<string[]>();
  const [isDeleting, setIsDeleting] = useState(false);
  const { isDragging } = useFileDrop({
    enabled: !progress,
    onFiles: uploadPhotos,
  });

  const handleToggle = (id: string) =>
    setSelected((current = []) =>
      current.includes(id)
        ? current.filter((other) => other !== id)
        : [...current, id],
    );

  const handleDelete = async (ids: string[]) => {
    const label = ids.length === 1 ? "1 photo" : `${ids.length} photos`;
    if (
      !window.confirm(
        `Delete ${label}? Deleted photos are removed from every gallery.`,
      )
    )
      return;

    setIsDeleting(true);
    await deletePhotos({ data: { ids } });
    await router.invalidate();
    setIsDeleting(false);
    setSelected(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Photos</h1>
        {selected ? (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground mr-2 text-sm">
              {selected.length} selected
            </span>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() =>
                setSelected(
                  selected.length === photos.length
                    ? []
                    : photos.map((photo) => photo.id),
                )
              }
            >
              {selected.length === photos.length ? "Select none" : "Select all"}
            </Button>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setSelected(undefined)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!selected.length || isDeleting}
              onClick={() => handleDelete(selected)}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        ) : (
          <div className="ml-auto flex items-center gap-2">
            {photos.length > 0 && (
              <Button variant="outline" onClick={() => setSelected([])}>
                Select
              </Button>
            )}
            <UploadButton progress={progress} onFiles={uploadPhotos} />
          </div>
        )}
      </div>

      <UploadFailureList failures={failures} />

      {photos.length === 0 ? (
        <p className="text-muted-foreground">
          No photos yet. Upload some, or drop them anywhere on this page.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {photos.map((photo) => {
            const isSelected = selected?.includes(photo.id) ?? false;
            return (
              <li key={photo.id}>
                <button
                  type="button"
                  aria-pressed={selected && isSelected}
                  className={cn(
                    "focus-visible:ring-ring ring-offset-background relative block aspect-square w-full overflow-hidden rounded-md ring-offset-2 focus-visible:ring-2 focus-visible:outline-none",
                    isSelected && "ring-primary ring-2",
                  )}
                  onClick={() =>
                    selected ? handleToggle(photo.id) : setEditing(photo)
                  }
                >
                  <PhotoImage
                    photo={photo}
                    sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
                    className={cn(
                      "h-full object-cover",
                      isSelected && "opacity-80",
                    )}
                  />
                  {isSelected && (
                    <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex size-6 items-center justify-center rounded-full">
                      <Check className="size-4" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {isDragging && <FileDropOverlay isUploading={!!progress} />}

      {editing && (
        <PhotoEditDialog
          key={editing.id}
          photo={editing}
          onClose={() => setEditing(undefined)}
        />
      )}
    </div>
  );
}
