import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { imageContentTypeSchema } from "@/features/admin/uploads/lib/upload-schema";

const ACCEPT = imageContentTypeSchema.options.join(",");

export function UploadButton({
  isUploading,
  onFiles,
}: {
  isUploading: boolean;
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
      <Button disabled={isUploading} onClick={() => inputRef.current?.click()}>
        <Upload />
        Upload photos
      </Button>
    </>
  );
}
