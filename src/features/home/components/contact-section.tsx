import { useState } from "react";
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
import { useSiteSettings } from "@/hooks/use-site-settings";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "failed";

export function ContactSection({ sessions }: { sessions: string[] }) {
  const sessionItems = [...sessions, OTHER_SESSION].map((session) => ({
    value: session,
    label: session,
  }));
  const [session, setSession] = useState(sessionItems[0].value);
  const [status, setStatus] = useState<Status>("idle");
  const { email } = useSiteSettings();

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
      className="bg-cream flex min-h-svh scroll-mt-16 flex-col justify-center px-6 py-24 sm:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
            Contact
          </p>
          <h2 className="text-5xl leading-none sm:text-6xl">
            Let's plan your <em>session.</em>
          </h2>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Tell me a little about what you have in mind.
          </p>
          {email && (
            <a href={`mailto:${email}`} className="mt-3 self-start">
              {email}
            </a>
          )}
        </div>

        {/* Both sit in one grid cell, so the section keeps the height of the form after a send. */}
        <div className="grid">
          {status === "sent" && (
            <p
              role="status"
              className="self-center text-center text-lg [grid-area:1/1]"
            >
              Thank you! Your message is on its way, and I'll reply by email.
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            inert={status === "sent"}
            className={cn(
              "flex flex-col gap-4 [grid-area:1/1]",
              status === "sent" && "invisible",
            )}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  name="name"
                  required
                  autoComplete="name"
                  className="bg-background h-11"
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
                  className="bg-background h-11"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contact-session">Session</Label>
                <Select
                  items={sessionItems}
                  value={session}
                  onValueChange={(value) => value && setSession(value)}
                >
                  <SelectTrigger
                    id="contact-session"
                    className="bg-background w-full data-[size=default]:h-11"
                  >
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
                  className="bg-background h-11"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                name="message"
                required
                className="bg-background min-h-32"
              />
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
              className="h-12 self-start px-8 text-xs tracking-[0.2em] uppercase"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
