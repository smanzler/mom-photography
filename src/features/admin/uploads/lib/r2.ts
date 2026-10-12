import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const UPLOAD_URL_TTL_SECONDS = 60 * 5;

/** The browser must send the same `Content-Type` header with the PUT, or R2 rejects the signature. */
export const createUploadUrl = async ({
  key,
  contentType,
}: {
  key: string;
  contentType: string;
}) => {
  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2, command, { expiresIn: UPLOAD_URL_TTL_SECONDS });
};

export const hasObject = async (key: string) => {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
};

export const deleteObject = async (key: string) => {
  await r2.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
};
