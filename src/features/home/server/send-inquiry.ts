import { createServerFn } from "@tanstack/react-start";
import {
  buildInquiryText,
  inquiryInputSchema,
} from "@/features/home/lib/inquiry-schema";
import { env } from "@/lib/env";
import { mailer } from "@/lib/mailer";

/** Emails the inquiry to every admin. Replies go to the visitor. */
export const sendInquiry = createServerFn({ method: "POST" })
  .validator(inquiryInputSchema)
  .handler(async ({ data }) => {
    // Act as if the send worked, so a bot gets no signal.
    if (data.website) return;

    await mailer.sendMail({
      from: env.SMTP_FROM,
      to: env.ADMIN_EMAILS,
      replyTo: { name: data.name, address: data.email },
      subject: `New inquiry from ${data.name}: ${data.session}`,
      text: buildInquiryText(data),
    });
  });
