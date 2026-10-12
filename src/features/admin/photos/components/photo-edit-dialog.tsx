import { useRouter } from "@tanstack/react-router";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { deletePhoto } from "@/features/admin/photos/server/delete-photo";
import { updatePhoto } from "@/features/admin/photos/server/update-photo";

export type EditablePhoto = PhotoImageSource & {
  id: string;
  caption: string | null;
};

export function PhotoEditDialog({
  photo,
  onClose,
}: {
  photo: EditablePhoto;
  onClose: () => void;
}) {
  const router = useRouter();
  const [alt, setAlt] = useState(photo.alt);
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [isPending, setIsPending] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    await updatePhoto({
      data: { id: photo.id, alt, caption: caption || null },
    });
    await router.invalidate();
    onClose();
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this photo? It is removed from every gallery."))
      return;

    setIsPending(true);
    await deletePhoto({ data: { id: photo.id } });
    await router.invalidate();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <PhotoImage
            photo={photo}
            sizes="32rem"
            className="max-h-80 rounded-md object-contain"
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="alt">Description for screen readers</Label>
            <Input
              id="alt"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              className="sm:mr-auto"
              disabled={isPending}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
