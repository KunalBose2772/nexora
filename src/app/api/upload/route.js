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
        return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
    }
}
