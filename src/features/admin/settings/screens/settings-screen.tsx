import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveSiteSettings } from "@/features/admin/settings/server/save-site-settings";
import type { SiteSettings } from "@/lib/site-settings";

export function SettingsScreen({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [name, setName] = useState(settings.name);
  const [tagline, setTagline] = useState(settings.tagline);
  const [description, setDescription] = useState(settings.description);
  const [email, setEmail] = useState(settings.email ?? "");
  const [isPending, setIsPending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    await saveSiteSettings({
      data: { name, tagline, description, email: email.trim() || null },
    });
    await router.invalidate();
    setIsPending(false);
    setIsSaved(true);
  };

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">
          These show across the whole site, in page titles and in emails.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        onChange={() => setIsSaved(false)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Business name</Label>
          <Input
            id="name"
            required
            placeholder="Jane Doe Photography"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <p className="text-muted-foreground text-sm">
            Shows in the header, the footer and every page title.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            placeholder="Family and wedding photography in Portland"
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
          />
          <p className="text-muted-foreground text-sm">
            Shows in the homepage title in search results and browser tabs.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <p className="text-muted-foreground text-sm">
            The short summary search engines and link previews show.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Contact email</Label>
          <Input
            id="email"
            type="email"
            placeholder="hello@yourdomain.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <p className="text-muted-foreground text-sm">
            Shows beside the contact form. Leave it empty to hide it.
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
      </form>
    </div>
  );
}
