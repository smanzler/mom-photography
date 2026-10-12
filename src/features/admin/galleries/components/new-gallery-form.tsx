import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createGallery } from "@/features/admin/galleries/server/create-gallery";

export function NewGalleryForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const gallery = await createGallery({ data: { title } });
    await router.navigate({
      to: "/admin/galleries/$galleryId",
      params: { galleryId: gallery.id },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        aria-label="Gallery title"
        placeholder="New gallery title"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Button type="submit" disabled={isPending}>
        Create
      </Button>
    </form>
  );
}
