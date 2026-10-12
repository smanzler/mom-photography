import { createServerFn } from "@tanstack/react-start";
import { findAdminSession } from "@/features/admin/auth/lib/find-admin-session";

export const getAdminSession = createServerFn().handler(async () => {
  const session = await findAdminSession();
  if (!session) return null;

  return { user: { email: session.user.email, name: session.user.name } };
});
