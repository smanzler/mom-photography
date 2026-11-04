import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { GalleryLayoutPhoto } from "@/features/gallery/lib/gallery-layout-props";
import { cn } from "cn";

// A horizontal swipe shorter than this, in pixels, snaps back.
const SWIPE_DISTANCE = 50;

const NEIGHBOURS = [-1, 0, 1] as const;

type Neighbour = (typeof NEIGHBOURS)[number];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Overrides the Button press nudge, hover fill and transitions.
const VIEWER_BUTTON =
  "text-white transition-none hover:bg-transparent hover:text-white hover:opacity-70 active:not-aria-[haspopup]:translate-y-0 aria-expanded:bg-transparent";

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
  const [dragOffset, setDragOffset] = useState(0);
  const [settlingTo, setSettlingTo] = useState<Neighbour | null>(null);
  // Keys the slides, so a slide keeps its loaded image when it becomes the current one.
  const [position, setPosition] = useState(0);
  const photo = index === null ? undefined : photos.at(index);
  const canStep = photos.length > 1;

  const wrap = (i: number) => (i + photos.length) % photos.length;

  const step = (by: number) => {
    if (index === null) return;
    setPosition((current) => current + by);
    onIndexChange(wrap(index + by));
  };

  const settle = () => {
    if (settlingTo) step(settlingTo);
    setSettlingTo(null);
    setDragOffset(0);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (!canStep || settlingTo !== null) return;
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    if (start === null) return;
    setDragOffset(event.touches[0].clientX - start);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    touchStartX.current = null;
    // With no change to the transform, no transitionend comes to stop the settle.
    if (dragOffset === 0) return;

    const target: Neighbour =
      Math.abs(dragOffset) < SWIPE_DISTANCE ? 0 : dragOffset < 0 ? 1 : -1;
    if (prefersReducedMotion()) {
      if (target) step(target);
      setDragOffset(0);
      return;
    }
    setSettlingTo(target);
  };

  const trackTransform =
    settlingTo === null
      ? `translateX(calc(-100% + ${dragOffset}px))`
      : `translateX(${-100 - settlingTo * 100}%)`;

  return (
    <Dialog
      open={photo !== undefined}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogContent
        showCloseButton={false}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
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
                    className={cn("size-11", VIEWER_BUTTON)}
                  />
                }
              >
                <XIcon className="size-6" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <div
                // Tailwind cannot take the drag distance from a runtime value.
                style={{ transform: trackTransform }}
                className={cn(
                  "flex h-full touch-pan-y",
                  settlingTo !== null &&
                    "transition-transform duration-300 ease-out",
                )}
                onTransitionEnd={(event) =>
                  event.target === event.currentTarget && settle()
                }
              >
                {NEIGHBOURS.map((neighbour) => {
                  const slide = photos[wrap(index + neighbour)];
                  return (
                    <figure
                      key={position + neighbour}
                      aria-hidden={neighbour !== 0}
                      className="flex h-full w-full shrink-0 flex-col items-center justify-center gap-3 px-4 pb-6 sm:px-20"
                    >
                      {(neighbour === 0 || canStep) && (
                        <>
                          <PhotoImage
                            photo={slide}
                            sizes="100vw"
                            loading="eager"
                            className="h-auto max-h-full min-h-0 w-auto max-w-full object-contain"
                          />
                          {slide.caption && (
                            <figcaption className="text-sm text-white/75">
                              {slide.caption}
                            </figcaption>
                          )}
                        </>
                      )}
                    </figure>
                  );
                })}
              </div>
            </div>
            {canStep && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous photo"
                  className={cn(
                    "absolute inset-y-0 left-2 my-auto hidden size-12 sm:flex",
                    VIEWER_BUTTON,
                  )}
                  onClick={() => step(-1)}
                >
                  <ChevronLeft className="size-7" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next photo"
                  className={cn(
                    "absolute inset-y-0 right-2 my-auto hidden size-12 sm:flex",
                    VIEWER_BUTTON,
                  )}
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
