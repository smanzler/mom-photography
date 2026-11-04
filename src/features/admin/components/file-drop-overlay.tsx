import { Upload } from "lucide-react";

export function FileDropOverlay({ isUploading }: { isUploading: boolean }) {
  return (
    <div
      aria-hidden
      className="bg-background/90 pointer-events-none fixed inset-0 z-50 flex items-center justify-center rounded-[inherit] p-6"
    >
      <div className="border-foreground/40 flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed">
        <Upload className="size-10" />
        <p className="text-lg font-medium">
          {isUploading
            ? "Wait for the upload to finish"
            : "Drop photos to upload"}
        </p>
      </div>
    </div>
  );
}
