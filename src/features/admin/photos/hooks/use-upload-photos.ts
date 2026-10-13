import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { readImage } from "@/features/admin/photos/lib/read-image";
import { createPhoto } from "@/features/admin/photos/server/create-photo";
import { imageContentTypeSchema } from "@/features/admin/uploads/lib/upload-schema";
import { createUpload } from "@/features/admin/uploads/server/create-upload";

export type UploadFailure = { name: string; message: string };

const uploadPhoto = async (file: File) => {
  const parsed = imageContentTypeSchema.safeParse(file.type);
  if (!parsed.success) throw new Error("Not a JPEG, PNG, WebP or AVIF image");
  const contentType = parsed.data;
  const image = await readImage(file);
  const { key, uploadUrl } = await createUpload({ data: { contentType } });

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });
  if (!response.ok) throw new Error(`Upload failed (${response.status})`);

  await createPhoto({ data: { key, alt: "", ...image } });
};

const toUploadFailure = (file: File, reason: unknown): UploadFailure => ({
  name: file.name,
  message: reason instanceof Error ? reason.message : "Upload failed",
});

export const useUploadPhotos = () => {
  const router = useRouter();
  const [progress, setProgress] = useState<{ done: number; total: number }>();
  const [failures, setFailures] = useState<UploadFailure[]>([]);

  const uploadPhotos = async (files: File[]) => {
    setFailures([]);
    setProgress({ done: 0, total: files.length });

    // One at a time: each file is decoded in memory, and large photos use a lot of it.
    const results: UploadFailure[] = [];
    for (const file of files) {
      await uploadPhoto(file).catch((reason: unknown) => {
        results.push(toUploadFailure(file, reason));
      });
      setProgress(
        (current) => current && { ...current, done: current.done + 1 },
      );
    }

    setFailures(results);
    setProgress(undefined);
    await router.invalidate();
  };

  return { uploadPhotos, progress, failures };
};
