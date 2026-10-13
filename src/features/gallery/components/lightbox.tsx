import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { useRef } from "react";
import { PhotoImage } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryLayoutPhoto } from "@/features/gallery/lib/gallery-layout-props";

// A horizontal swipe shorter than this, in pixels, is a tap.
const SWIPE_DISTANCE = 50;

/** Shows `photos[index]` over the whole screen; `index: null` closes it. Steps wrap around at both ends. */
export function Lightbox({
  photos,
  index,
  onIndexChange,
}: {
  photos: GalleryLayoutPhoto[];
  index: number | null;
  onIndexChange: (index: number | null) => void;
}) {
  const touchStartX = useRef<number>(null);
  const photo = index === null ? undefined : photos.at(index);

  const step = (by: number) => {
    if (index === null) return;
    onIndexChange((index + by + photos.length) % photos.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start === null) return;

    const distance = event.changedTouches[0].clientX - start;
    if (Math.abs(distance) >= SWIPE_DISTANCE) step(distance < 0 ? 1 : -1);
  };

  return (
    <Dialog
      open={photo !== undefined}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogContent
        showCloseButton={false}
        onKeyDown={handleKeyDown}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
        className="top-0 left-0 flex h-svh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none bg-black p-0 text-white ring-0 sm:max-w-none"
      >
        {photo && index !== null && (
          <>
            <DialogTitle className="sr-only">
              Photo {index + 1} of {photos.length}
            </DialogTitle>
            <div className="flex items-center justify-between px-4 py-3 text-xs tracking-[0.2em]">
              <span aria-hidden>
                {index + 1} / {photos.length}
              </span>
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-11 text-white hover:bg-white/10 hover:text-white"
                  />
                }
              >
                <XIcon className="size-6" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <figure className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 pb-6 sm:px-20">
              <PhotoImage
                key={photo.id}
                photo={photo}
                sizes="100vw"
                loading="eager"
                className="h-auto max-h-full min-h-0 w-auto max-w-full object-contain"
              />
              {photo.caption && (
                <figcaption className="text-sm text-white/75">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous photo"
                  className="absolute top-1/2 left-2 hidden size-12 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:flex"
                  onClick={() => step(-1)}
                >
                  <ChevronLeft className="size-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next photo"
                  className="absolute top-1/2 right-2 hidden size-12 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white sm:flex"
                  onClick={() => step(1)}
                >
                  <ChevronRight className="size-7" />
                </Button>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
