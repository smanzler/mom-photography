import { createFileRoute } from "@tanstack/react-router";
import { AdminHomeScreen } from "@/features/admin/screens/admin-home-screen";

export const Route = createFileRoute("/admin/_authed/")({
  head: () => ({ meta: [{ title: "Admin" }] }),
  component: AdminHomeScreen,
});
