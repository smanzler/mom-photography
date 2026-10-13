import { useState } from "react";
import { PhotoImage } from "@/components/photo-image";
import type { PhotoImageSource } from "@/components/photo-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OTHER_SESSION } from "@/features/home/lib/inquiry-schema";
import { sendInquiry } from "@/features/home/server/send-inquiry";

type Status = "idle" | "sending" | "sent" | "failed";

export function ContactSection({
  sessions,
  photo,
}: {
  sessions: string[];
  photo: PhotoImageSource | undefined;
}) {
  const sessionItems = [...sessions, OTHER_SESSION].map((session) => ({
    value: session,
    label: session,
  }));
  const [session, setSession] = useState(sessionItems[0].value);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const field = (name: string) => String(form.get(name) ?? "");
    setStatus("sending");

    await sendInquiry({
      data: {
        name: field("name"),
        email: field("email"),
        session,
        date: field("date") || null,
        message: field("message"),
        website: field("website"),
      },
    })
      .then(() => setStatus("sent"))
      .catch(() => setStatus("failed"));
  };

  return (
    <section
      id="contact"
      className="bg-foreground relative scroll-mt-16 px-6 py-24 sm:py-32"
    >
      {photo && (
        <PhotoImage
          photo={photo}
          sizes="100vw"
          aria-hidden
          className="absolute inset-0 h-full object-cover"
        />
      )}
      <div className="bg-background relative mx-auto flex max-w-xl flex-col gap-7 p-7 sm:p-14">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl leading-none sm:text-5xl">
            Check my availability
          </h2>
          <p className="text-muted-foreground text-sm">
            Tell me a little about what you have in mind.
          </p>
        </div>

        {status === "sent" ? (
          <p role="status" className="text-lg">
            Thank you! Your message is on its way, and I'll reply by email.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                name="name"
                required
                autoComplete="name"
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-session">Session</Label>
                <Select
                  items={sessionItems}
                  value={session}
                  onValueChange={(value) => value && setSession(value)}
                >
                  <SelectTrigger id="contact-session" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-date">Date (optional)</Label>
                <Input
                  id="contact-date"
                  name="date"
                  type="date"
                  className="h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" name="message" required rows={4} />
            </div>
            <input
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />
            {status === "failed" && (
              <p role="alert" className="text-destructive text-sm">
                Your message could not be sent. Please try again.
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={status === "sending"}
              className="h-12 text-xs tracking-[0.2em] uppercase"
            >
              {status === "sending" ? "Sending…" : "Send inquiry"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
