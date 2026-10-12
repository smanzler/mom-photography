import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/features/admin/auth/lib/auth-client";
import { SITE } from "@/lib/site";

export function AdminLayout({
  email,
  children,
}: {
  email: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    await router.invalidate();
  };

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-border border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
          <Link to="/admin" className="font-semibold tracking-tight">
            {SITE.name} admin
          </Link>
          <div className="text-muted-foreground ml-auto flex items-center gap-4 text-sm">
            <span>{email}</span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 p-6">{children}</main>
    </div>
  );
}
