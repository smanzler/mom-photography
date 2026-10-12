import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  DATABASE_URL: z.string(),

  BETTER_AUTH_SECRET: z.string(),
  // Optional: better-auth gets the base URL from the request when this is not set.
  BETTER_AUTH_URL: z.string().optional(),
  ADMIN_EMAILS: z
    .string()
    .transform((value) => value.split(",").map((email) => email.trim()))
    .pipe(z.array(z.email().toLowerCase())),

  R2_ENDPOINT: z.url(),
  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  R2_BUCKET: z.string(),

  SMTP_HOST: z.string().default("localhost"),
  SMTP_PORT: z.coerce.number().default(1025),
  SMTP_SECURE: z.stringbool().default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().default("Photography <noreply@photography.local>"),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
