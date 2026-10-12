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
import { cn } from "@/lib/utils";

type PickablePhoto = PhotoImageSource & { id: string };

/** Calls `onPick` with the photo ids in the order the user selected them. */
export function PhotoPickerDialog({
  photos,
  onPick,
  onClose,
}: {
  photos: PickablePhoto[];
  onPick: (photoIds: string[]) => Promise<void>;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((other) => other !== id)
        : [...current, id],
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
          <DialogTitle>Add photos</DialogTitle>
        </DialogHeader>
        {photos.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Every photo in the library is already in this gallery.
          </p>
        ) : (
          <ul className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
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
                    {order !== -1 && (
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
        <DialogFooter>
          <Button disabled={!selected.length || isPending} onClick={handleAdd}>
            Add {selected.length || ""}{" "}
            {selected.length === 1 ? "photo" : "photos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
