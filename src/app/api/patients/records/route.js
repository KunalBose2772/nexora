import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const patientId = formData.get('patientId');
        const categoryTag = formData.get('categoryTag');
        const title = formData.get('title');
        const date = formData.get('date');
        const file = formData.get('file');

        if (!patientId || !categoryTag || !title || !file) {
            return NextResponse.json({ error: 'Missing required fields or file' }, { status: 400 });
        }

        // Process file upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const filePath = join(process.cwd(), 'public', 'uploads', filename);

        await writeFile(filePath, buffer);
        const fileUrl = `/uploads/${filename}`;

        const newRecord = await prisma.patientRecord.create({
            data: {
                tenantId: session.tenantId,
                patientId: patientId,
                categoryTag: categoryTag,
                title: title,
                date: date || new Date().toISOString().split('T')[0],
                fileUrl: fileUrl
            }
        });

        return NextResponse.json({ ok: true, record: newRecord }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/patients/records]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
