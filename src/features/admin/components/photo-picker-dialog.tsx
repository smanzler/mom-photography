import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileDropOverlay } from "@/features/admin/components/file-drop-overlay";
import { UploadButton } from "@/features/admin/components/upload-button";
import { UploadFailureList } from "@/features/admin/components/upload-failure-list";
import { useFileDrop } from "@/features/admin/hooks/use-file-drop";
import { useUploadPhotos } from "@/features/admin/hooks/use-upload-photos";
import { cn } from "cn";

type PickablePhoto = PhotoImageSource & { id: string };

type PickMode = "many" | "one";

const PICK_MODES: Record<
  PickMode,
  {
    title: string;
    showsOrder: boolean;
    add: (selected: string[], id: string) => string[];
    buttonLabel: (count: number) => string;
  }
> = {
  many: {
    title: "Add photos",
    showsOrder: true,
    add: (selected, id) => [...selected, id],
    buttonLabel: (count) =>
      `Add ${count || ""} ${count === 1 ? "photo" : "photos"}`,
  },
  one: {
    title: "Choose a photo",
    showsOrder: false,
    add: (_selected, id) => [id],
    buttonLabel: () => "Use photo",
  },
};

/**
 * Calls `onPick` with the photo ids in the order the user selected them.
 * Photos uploaded from the dialog go into the library and become selected,
 * so `photos` must come from a loader that `router.invalidate()` runs again.
 */
export function PhotoPickerDialog({
  photos,
  mode = "many",
  onPick,
  onClose,
}: {
  photos: PickablePhoto[];
  mode?: PickMode;
  onPick: (photoIds: string[]) => Promise<void>;
  onClose: () => void;
}) {
  const pickMode = PICK_MODES[mode];
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);
  const { uploadPhotos, progress, failures } = useUploadPhotos();

  const handleFiles = async (files: File[]) => {
    const uploadedIds = await uploadPhotos(files);
    setSelected((current) => uploadedIds.reduce(pickMode.add, current));
  };

  const { isDragging } = useFileDrop({
    enabled: !progress && !isPending,
    onFiles: handleFiles,
  });

  const handleToggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((other) => other !== id)
        : pickMode.add(current, id),
    );

  const handleAdd = async () => {
    setIsPending(true);
    await onPick(selected);
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{pickMode.title}</DialogTitle>
        </DialogHeader>
        {photos.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Every photo in the library is already added. Upload new ones, or
            drop them here.
          </p>
        ) : (
          <ul className="-m-1 grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto p-1 sm:grid-cols-5">
            {photos.map((photo) => {
              const order = selected.indexOf(photo.id);
              return (
                <li key={photo.id}>
                  <button
                    type="button"
                    aria-pressed={order !== -1}
                    className={cn(
                      "ring-offset-background relative block aspect-square w-full overflow-hidden rounded-md ring-offset-2",
                      order !== -1 && "ring-primary ring-2",
                    )}
                    onClick={() => handleToggle(photo.id)}
                  >
                    <PhotoImage
                      photo={photo}
                      sizes="10rem"
                      className="h-full object-cover"
                    />
                    {pickMode.showsOrder && order !== -1 && (
                      <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex size-6 items-center justify-center rounded-full text-xs">
                        {order + 1}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <UploadFailureList failures={failures} />
        <DialogFooter>
          <div className="sm:mr-auto">
            <UploadButton
              variant="outline"
              progress={progress}
              onFiles={handleFiles}
            />
          </div>
          <Button
            disabled={!selected.length || isPending || !!progress}
            onClick={handleAdd}
          >
            {pickMode.buttonLabel(selected.length)}
          </Button>
        </DialogFooter>
        {isDragging && <FileDropOverlay isUploading={!!progress} />}
      </DialogContent>
    </Dialog>
  );
}
