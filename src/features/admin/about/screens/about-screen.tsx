import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveAboutSection } from "@/features/admin/about/server/save-about-section";
import { PhotoPickerDialog } from "@/features/admin/components/photo-picker-dialog";

type LibraryPhoto = PhotoImageSource & { id: string };

export function AboutScreen({
  about,
  library,
}: {
  about: { heading: string; body: string; photo: LibraryPhoto | null } | null;
  library: LibraryPhoto[];
}) {
  const router = useRouter();
  const [heading, setHeading] = useState(about?.heading ?? "");
  const [body, setBody] = useState(about?.body ?? "");
  const [photoId, setPhotoId] = useState(about?.photo?.id ?? null);
  const [isPicking, setIsPicking] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const photo = library.find((candidate) => candidate.id === photoId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    await saveAboutSection({ data: { heading, body, photoId } });
    await router.invalidate();
    setIsPending(false);
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">About</h1>
        <p className="text-muted-foreground text-sm">
          This shows on the homepage, after the galleries.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onChange={() => setIsSaved(false)}
        className="grid gap-8 md:grid-cols-[16rem_1fr]"
      >
        <div className="flex flex-col gap-3">
          <Label>Photo</Label>
          <div className="bg-muted aspect-[4/5] overflow-hidden rounded-md">
            {photo && (
              <PhotoImage
                photo={photo}
                sizes="16rem"
                className="h-full object-cover"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPicking(true)}
            >
              {photo ? "Change photo" : "Choose photo"}
            </Button>
            {photo && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPhotoId(null);
                  setIsSaved(false);
                }}
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="heading">Heading</Label>
            <Input
              id="heading"
              required
              placeholder="Hi, I'm …"
              value={heading}
              onChange={(event) => setHeading(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="body">Text</Label>
            <Textarea
              id="body"
              required
              className="min-h-60"
              value={body}
              onChange={(event) => setBody(event.target.value)}
            />
            <p className="text-muted-foreground text-sm">
              Leave an empty line between paragraphs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
            {isSaved && (
              <span role="status" className="text-muted-foreground text-sm">
                Saved
              </span>
            )}
          </div>
        </div>
      </form>

      {isPicking && (
        <PhotoPickerDialog
          photos={library}
          mode="one"
          onPick={async ([id]) => {
            setPhotoId(id);
            setIsSaved(false);
          }}
          onClose={() => setIsPicking(false)}
        />
      )}
    </div>
  );
}
