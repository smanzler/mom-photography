import { env } from "@/lib/env";

export const isAdminEmail = (email: string) =>
  env.ADMIN_EMAILS.includes(email.toLowerCase());
