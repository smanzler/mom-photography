import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/features/admin/settings/screens/settings-screen";
import { getSiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/admin/_authed/settings")({
  loader: () => getSiteSettings(),
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: SettingsRoute,
});

function SettingsRoute() {
  return <SettingsScreen settings={Route.useLoaderData()} />;
}
