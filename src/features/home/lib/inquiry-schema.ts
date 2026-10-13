import { z } from "zod";

export const OTHER_SESSION = "Something else";

export const inquiryInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  session: z.string().trim().min(1).max(100),
  date: z.iso.date().nullable(),
  message: z.string().trim().min(1).max(5000),
  // A hidden field that only bots fill in.
  website: z.string().max(500),
});
export type InquiryInput = z.infer<typeof inquiryInputSchema>;

export const buildInquiryText = ({
  name,
  email,
  session,
  date,
  message,
}: InquiryInput) =>
  [
    `Name: ${name}`,
    `Email: ${email}`,
    `Session: ${session}`,
    `Preferred date: ${date ?? "not given"}`,
    "",
    message,
  ].join("\n");
