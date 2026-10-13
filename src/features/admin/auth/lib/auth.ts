import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import * as schema from "@/db/auth-schema";
import { isAdminEmail } from "@/features/admin/auth/lib/is-admin-email";
import { mailer } from "@/lib/mailer";
import { renderOtpEmail } from "@/features/admin/auth/lib/render-otp-email";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

const OTP_EXPIRES_IN_MINUTES = 5;

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", usePlural: true, schema }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => isAdminEmail(user.email),
      },
    },
  },
  plugins: [
    emailOTP({
      expiresIn: OTP_EXPIRES_IN_MINUTES * 60,
      async sendVerificationOTP({ email, otp }) {
        // Do not tell the caller which emails are admins.
        if (!isAdminEmail(email)) return;

        const subject = "Your sign in code";
        const { html, text } = renderOtpEmail({
          otp,
          heading: subject,
          expiresInMinutes: OTP_EXPIRES_IN_MINUTES,
        });

        await mailer.sendMail({
          from: env.SMTP_FROM,
          to: email,
          subject,
          html,
          text,
        });
      },
    }),
    // Must be last: it sets the cookies from the responses of the plugins above.
    tanstackStartCookies(),
  ],
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});
