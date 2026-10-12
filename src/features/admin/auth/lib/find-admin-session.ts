import { createServerOnlyFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@/features/admin/auth/lib/auth";
import { isAdminEmail } from "@/features/admin/auth/lib/is-admin-email";

/** Returns `null` when the request has no session or the user is no longer an admin. */
export const findAdminSession = createServerOnlyFn(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });
  if (!session || !isAdminEmail(session.user.email)) return null;

  return session;
});
