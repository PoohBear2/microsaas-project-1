import {z} from 'zod';
import {NextResponse} from 'next/server';
import {v4 as uuidv4} from 'uuid';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3 } from '@/lib/s3Client';

const uploadSchema = z.object({
    fileName: z.string(),
    contentType: z.string(),
    size: z.number()
})

export async function POST(request: Request) {

    try { 
        const body = await request.json();
        const parsed = uploadSchema.safeParse(body);

        if(!parsed.success) {
            return NextResponse.json({error: 'Invalid request body'}, {status: 400});
        }

        const {fileName, contentType, size} = parsed.data;
        const uniqueKey = `${uuidv4()}-${fileName}`;
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: uniqueKey,
            ContentType: contentType,
            ContentLength: size
        })

        const preSignedUrl = await getSignedUrl(S3,  command, {
            expiresIn: 360 // 6 minutes
        } )

        const response = {
            preSignedUrl,
            key: uniqueKey
        }
        return NextResponse.json(response, {status: 200});

     } catch {
         return NextResponse.json({error: 'Internal Server Error'}, {status: 500}); 
    }
}