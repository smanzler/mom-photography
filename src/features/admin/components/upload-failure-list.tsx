import type { UploadFailure } from "@/features/admin/hooks/use-upload-photos";

export function UploadFailureList({ failures }: { failures: UploadFailure[] }) {
  if (!failures.length) return null;

  return (
    <ul className="border-destructive/50 text-destructive rounded-md border p-4 text-sm">
      {failures.map((failure) => (
        <li key={failure.name}>
          {failure.name}: {failure.message}
        </li>
      ))}
    </ul>
  );
}
