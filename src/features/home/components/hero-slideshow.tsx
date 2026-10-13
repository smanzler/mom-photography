import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { cn } from "@/lib/utils";

/** Fills the screen. Moves to the next photo when the bar of the current photo is full. */
export function HeroSlideshow({
  photos,
}: {
  photos: (PhotoImageSource & { id: string })[];
}) {
  const [index, setIndex] = useState(0);

  const showNext = () => setIndex((current) => (current + 1) % photos.length);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured photographs"
      className="relative h-svh min-h-[32rem] overflow-hidden bg-black"
    >
      {photos.map((photo, i) => (
        <PhotoImage
          key={photo.id}
          photo={photo}
          sizes="100vw"
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 h-full object-cover transition-opacity duration-1000 motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div aria-hidden className="absolute inset-0 bg-black/20" />

      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 flex gap-2 px-4 pb-4 sm:px-12">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className="flex h-11 flex-1 cursor-pointer items-center"
              onClick={() => setIndex(i)}
            >
              <span className="block h-0.5 w-full bg-white/35">
                <span
                  className={cn(
                    "block h-full origin-left bg-white",
                    i < index && "scale-x-100",
                    i > index && "scale-x-0",
                    i === index &&
                      "animate-hero-progress motion-reduce:animate-none",
                  )}
                  onAnimationEnd={showNext}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
