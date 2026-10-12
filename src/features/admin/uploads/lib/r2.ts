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
  endpoint: env.R2_ENDPOINT,
  // The local S3 mock takes the bucket from the path, not the host. R2 accepts both.
  forcePathStyle: true,
  // A presign has no body, so the SDK would sign the checksum of an empty body and the bucket would reject the real file.
  requestChecksumCalculation: "WHEN_REQUIRED",
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
