import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Cloud Upload via ImgBB (Required for Vercel/Production)
        const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
        if (IMGBB_API_KEY) {
            const base64Image = buffer.toString('base64');
            const imgbbFormData = new URLSearchParams();
            imgbbFormData.append('key', IMGBB_API_KEY);
            imgbbFormData.append('image', base64Image);

            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: imgbbFormData,
            });

            const data = await response.json();
            if (data.success) {
                return NextResponse.json({ ok: true, url: data.data.url });
            } else {
                throw new Error(data.error?.message || 'ImgBB upload failed');
            }
        }

        // 2. Fallback to Local Filesystem (For development only, will fail on Vercel)
        console.warn('IMGBB_API_KEY not found in environment variables. Falling back to local upload which is not recommended for Serverless deployments like Vercel.');
        const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');

        // Ensure the directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = path.join(uploadDir, filename);
        fs.writeFileSync(filepath, buffer);

        // Return the public URL for the image
        const url = `/uploads/${filename}`;

        return NextResponse.json({ ok: true, url });
    } catch (err) {
        console.error('[POST /api/upload]', err);
        return NextResponse.json({ error: 'Failed to upload image. Please check logs or set IMGBB_API_KEY in Live environments.' }, { status: 500 });
    }
}
