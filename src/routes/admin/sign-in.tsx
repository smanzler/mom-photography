import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInScreen } from "@/features/admin/auth/screens/sign-in-screen";
import { getAdminSession } from "@/features/admin/auth/server/get-admin-session";

export const Route = createFileRoute("/admin/sign-in")({
  beforeLoad: async () => {
    if (await getAdminSession()) throw redirect({ to: "/admin" });
  },
  head: () => ({
    meta: [{ title: "Sign in" }, { name: "robots", content: "noindex" }],
  }),
  component: SignInScreen,
});
