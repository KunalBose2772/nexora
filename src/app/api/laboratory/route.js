import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const labRequests = await prisma.labRequest.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ labRequests });
    } catch (error) {
        console.error('Fetch Lab Requests Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const { patientId, patientName, patientUhId, tests, referringDoctor, collectionTime } = data;

        if (!patientName || !tests || tests.length === 0) {
            return NextResponse.json({ error: 'Patient name and at least one test are required' }, { status: 400 });
        }

        // Generate a unique tracking ID base
        const count = await prisma.labRequest.count({ where: { tenantId: session.tenantId } });
        const trackingIdBase = `LAB-${String(count + 1).padStart(4, '0')}`;

        const createdRequests = [];
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const labReq = await prisma.labRequest.create({
                data: {
                    trackingId: `${trackingIdBase}-${(i + 1).toString().padStart(2, '0')}`,
                    patientName,
                    patientUhId: patientUhId || null,
                    patientId: patientId || null,
                    testName: test.name,
                    category: test.category || 'General',
                    amount: test.price || 0,
                    referringDoctor: referringDoctor || null,
                    collectionTime: collectionTime || null,
                    tenantId: session.tenantId,
                }
            });
            createdRequests.push(labReq);
        }

        return NextResponse.json({ message: 'Lab requests created', labRequests: createdRequests }, { status: 201 });
    } catch (error) {
        console.error('Create Lab Request Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await req.json();
        if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });

        const updated = await prisma.labRequest.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ labRequest: updated });
    } catch (error) {
        console.error('Update Lab Request Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
