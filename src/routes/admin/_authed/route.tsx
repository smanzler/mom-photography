import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminSession } from "@/features/admin/auth/server/get-admin-session";
import { AdminLayout } from "@/features/admin/components/admin-layout";

export const Route = createFileRoute("/admin/_authed")({
  beforeLoad: async () => {
    const session = await getAdminSession();
    if (!session) throw redirect({ to: "/admin/sign-in" });

    return { user: session.user };
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user } = Route.useRouteContext();

  return (
    <AdminLayout email={user.email}>
      <Outlet />
    </AdminLayout>
  );
}
