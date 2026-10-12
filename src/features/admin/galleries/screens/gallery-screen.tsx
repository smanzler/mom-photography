import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryDetailsForm } from "@/features/admin/galleries/components/gallery-details-form";
import type { UpdateGalleryInput } from "@/features/admin/galleries/lib/gallery-schema";
import { deleteGallery } from "@/features/admin/galleries/server/delete-gallery";

export function GalleryScreen({ gallery }: { gallery: UpdateGalleryInput }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Delete "${gallery.title}"? Its photos stay in the library.`,
      )
    )
      return;

    await deleteGallery({ data: { id: gallery.id } });
    await router.navigate({ to: "/admin/galleries" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          render={<Link to="/admin/galleries" />}
        >
          <ArrowLeft />
          <span className="sr-only">Back to galleries</span>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">
          {gallery.title}
        </h1>
        <Button
          variant="destructive"
          className="ml-auto"
          onClick={handleDelete}
        >
          Delete gallery
        </Button>
      </div>
      <GalleryDetailsForm key={JSON.stringify(gallery)} gallery={gallery} />
    </div>
  );
}
