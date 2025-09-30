import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'microsaas-project-1';

export async function POST(request: NextRequest) {
  try {
    const { filename, contentType, size } = await request.json();

    console.log('📥 Presigned URL request:', { filename, contentType, size });

    // Validate required fields
    if (!filename || !contentType) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    // Optional: Add file size limit (10MB)
    if (size && size > 10 * 1024 * 1024) {
      console.error('❌ File too large:', size);
      return NextResponse.json(
        { error: 'File size too large. Maximum 10MB allowed.' },
        { status: 400 }
      );
    }

    // Generate unique file key with UUID to avoid conflicts - NO SUBFOLDERS
    const fileExtension = filename.split('.').pop() || '';
    const key = `${randomUUID()}.${fileExtension}`;

    console.log('🔑 Generated key:', key);

    // Create the put object command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
      Metadata: {
        'original-filename': filename,
        'upload-time': new Date().toISOString(),
      },
    });

    // Generate presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    // Public URL for accessing the file after upload
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${key}`;

    console.log('✅ Generated URLs:', { key, publicUrl });

    return NextResponse.json({
      presignedUrl,
      key,
      publicUrl,
    });

  } catch (error) {
    console.error('❌ Error generating presigned URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { 
        error: 'Failed to generate presigned URL',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400',
    },
  });
}