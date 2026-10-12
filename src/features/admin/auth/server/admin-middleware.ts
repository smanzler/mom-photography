import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { findAdminSession } from "@/features/admin/auth/lib/find-admin-session";

/** Use on every admin server function. Route guards do not protect the RPC endpoint. */
export const adminMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await findAdminSession();
    if (!session) {
      setResponseStatus(401);
      throw new Error("Unauthorized");
    }

    return next({ context: { user: session.user } });
  },
);
