import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/features/site/components/site-layout";

export function NotFoundScreen() {
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-32 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="text-muted-foreground">
          The page you asked for does not exist, or it has moved.
        </p>
        <Button render={<Link to="/" />} size="lg">
          Back to home
        </Button>
      </div>
    </SiteLayout>
  );
}
