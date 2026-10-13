import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { cn } from "@/lib/utils";

export function AboutSection({
  about,
}: {
  about: { heading: string; body: string; photo: PhotoImageSource | null };
}) {
  const paragraphs = about.body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section
      id="about"
      className="flex min-h-svh scroll-mt-16 flex-col justify-center px-6 py-24"
    >
      <div
        className={cn(
          "mx-auto grid w-full max-w-6xl items-center gap-10 md:gap-24",
          about.photo ? "md:grid-cols-2" : "max-w-2xl",
        )}
      >
        {about.photo && (
          <div className="bg-muted aspect-[4/5] overflow-hidden">
            <PhotoImage
              photo={about.photo}
              sizes="(min-width: 768px) 36rem, 100vw"
              className="h-full object-cover"
            />
          </div>
        )}
        <div className="flex flex-col gap-6">
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            About
          </p>
          <h2 className="text-5xl leading-none sm:text-6xl">{about.heading}</h2>
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="text-muted-foreground leading-relaxed whitespace-pre-line"
            >
              {paragraph}
            </p>
          ))}
          <a
            href="#contact"
            className="mt-2 self-start text-xs tracking-[0.2em] uppercase underline underline-offset-8"
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
