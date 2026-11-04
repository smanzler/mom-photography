import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { UploadProgress } from "@/features/admin/hooks/use-upload-photos";
import { imageContentTypeSchema } from "@/features/admin/uploads/lib/upload-schema";

const ACCEPT = imageContentTypeSchema.options.join(",");

export function UploadButton({
  progress,
  variant,
  onFiles,
}: {
  progress: UploadProgress | undefined;
  variant?: React.ComponentProps<typeof Button>["variant"];
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length) onFiles(files);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={handleChange}
      />
      <Button
        variant={variant}
        disabled={!!progress}
        onClick={() => inputRef.current?.click()}
      >
        <Upload />
        {progress
          ? `Uploading ${progress.done + 1} of ${progress.total}…`
          : "Upload photos"}
      </Button>
    </>
  );
}
