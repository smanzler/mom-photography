import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import { PhotoEditDialog } from "@/features/admin/photos/components/photo-edit-dialog";
import type { EditablePhoto } from "@/features/admin/photos/components/photo-edit-dialog";
import { UploadButton } from "@/features/admin/photos/components/upload-button";
import { useUploadPhotos } from "@/features/admin/photos/hooks/use-upload-photos";

export function PhotosScreen({ photos }: { photos: EditablePhoto[] }) {
  const { uploadPhotos, progress, failures } = useUploadPhotos();
  const [editing, setEditing] = useState<EditablePhoto>();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Photos</h1>
        <div className="ml-auto flex items-center gap-4">
          {progress && (
            <span className="text-muted-foreground text-sm">
              Uploading {progress.done + 1} of {progress.total}…
            </span>
          )}
          <UploadButton isUploading={!!progress} onFiles={uploadPhotos} />
        </div>
      </div>

      {failures.length > 0 && (
        <ul className="border-destructive/50 text-destructive rounded-md border p-4 text-sm">
          {failures.map((failure) => (
            <li key={failure.name}>
              {failure.name}: {failure.message}
            </li>
          ))}
        </ul>
      )}

      {photos.length === 0 ? (
        <p className="text-muted-foreground">
          No photos yet. Upload some to start.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {photos.map((photo) => (
            <li key={photo.id}>
              <button
                type="button"
                className="focus-visible:ring-ring block aspect-square w-full overflow-hidden rounded-md focus-visible:ring-2 focus-visible:outline-none"
                onClick={() => setEditing(photo)}
              >
                <PhotoImage
                  photo={photo}
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
                  className="h-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

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
