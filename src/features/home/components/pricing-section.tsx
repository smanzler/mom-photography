import { cn } from "@/lib/utils";

type PricingPackage = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  features: string[];
  isHighlighted: boolean;
};

type Tone = "plain" | "highlighted";

const TONES: Record<
  Tone,
  { card: string; description: string; list: string; button: string }
> = {
  plain: {
    card: "border-border",
    description: "text-muted-foreground",
    list: "border-border",
    button: "border-foreground",
  },
  highlighted: {
    card: "bg-foreground text-background border-foreground",
    description: "text-background/75",
    list: "border-background/20",
    button: "bg-background text-foreground border-background",
  },
};

export function PricingSection({ packages }: { packages: PricingPackage[] }) {
  return (
    <section id="pricing" className="scroll-mt-16 px-6 py-24 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Pricing
          </p>
          <h2 className="text-5xl leading-none sm:text-6xl">
            Sessions &amp; packages
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pricingPackage) => {
            const tone =
              TONES[pricingPackage.isHighlighted ? "highlighted" : "plain"];
            return (
              <article
                key={pricingPackage.id}
                className={cn(
                  "flex flex-col gap-5 border px-8 py-10",
                  tone.card,
                )}
              >
                <h3 className="font-sans text-xs font-medium tracking-[0.24em] uppercase">
                  {pricingPackage.name}
                </h3>
                <p className="font-heading text-5xl leading-none">
                  {pricingPackage.price}
                </p>
                {pricingPackage.description && (
                  <p
                    className={cn("text-sm leading-relaxed", tone.description)}
                  >
                    {pricingPackage.description}
                  </p>
                )}
                <ul
                  className={cn(
                    "flex flex-1 flex-col gap-3 border-t pt-5 text-sm",
                    tone.list,
                  )}
                >
                  {pricingPackage.features.map((feature, i) => (
                    <li key={`${i}-${feature}`}>{feature}</li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={cn(
                    "border px-5 py-3.5 text-center text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-80",
                    tone.button,
                  )}
                >
                  Book {pricingPackage.name}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
