import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

export const S3 = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to generate S3 URL for displaying images
export function getS3Url(key: string): string {
  const bucket = process.env.S3_BUCKET_NAME || "microsaas-project-1";
  const region = process.env.AWS_REGION || "us-east-2";
  
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}