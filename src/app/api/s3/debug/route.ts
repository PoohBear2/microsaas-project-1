// Create this file: app/api/s3/debug/route.ts

import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/s3Client";

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "uploads-locale";

export async function GET() {
  try {
    console.log('🔍 Listing objects in bucket:', BUCKET_NAME);
    
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      MaxKeys: 50, // Limit to 50 objects for debugging
    });

    const response = await S3.send(command);
    
    console.log('📋 Found', response.Contents?.length || 0, 'objects');
    
    const objects = response.Contents?.map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      etag: obj.ETag
    })) || [];

    return NextResponse.json({
      bucketName: BUCKET_NAME,
      objectCount: objects.length,
      objects: objects
    });

  } catch (error) {
    console.error("❌ Error listing S3 objects:", error);
    return NextResponse.json(
      { 
        error: "Failed to list objects",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}