import { useEffect, useRef, useState } from "react";

const hasFiles = (event: DragEvent) =>
  event.dataTransfer?.types.includes("Files") ?? false;

/**
 * Takes files dropped anywhere on the window. While `enabled` is false, a drop does nothing.
 * `isDragging` is true while files are over the window.
 */
export const useFileDrop = ({
  enabled,
  onFiles,
}: {
  enabled: boolean;
  onFiles: (files: File[]) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  // dragenter and dragleave fire for every child element, so count them.
  const depth = useRef(0);

  useEffect(() => {
    const handleDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth.current += 1;
      setIsDragging(true);
    };

    const handleDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setIsDragging(false);
    };

    // Without this, the browser does not allow a drop.
    const handleDragOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault();
    };

    const handleDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return;
      // Stops the browser from opening the file in place of the admin.
      event.preventDefault();
      depth.current = 0;
      setIsDragging(false);

      const files = Array.from(event.dataTransfer?.files ?? []);
      if (enabled && files.length) onFiles(files);
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [enabled, onFiles]);

  return { isDragging };
};
