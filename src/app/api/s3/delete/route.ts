import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/s3Client";

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "microsaas-project-1";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { key } = body;

    console.log('🗑️ Delete request for key:', key);

    if (!key || typeof key !== "string") {
      console.error('❌ Missing or invalid key');
      return NextResponse.json(
        { error: "Missing or invalid object key." },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await S3.send(command);
    
    console.log('✅ File deleted successfully:', key);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file." },
      { status: 500 }
    );
  }
}