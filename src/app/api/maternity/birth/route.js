import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { laborRecordId, gender, weight, apgar1m, apgar5m, statusUpdate } = body;

        const birth = await prisma.birthRecord.create({
            data: {
                laborRecordId,
                gender: gender || 'Unknown',
                weight: parseFloat(weight) || 0,
                apgar1m: parseInt(apgar1m) || 0,
                apgar5m: parseInt(apgar5m) || 0,
                tenantId: session.tenantId
            }
        });

        // If statusUpdate is provided, update the LaborRecord status
        if (statusUpdate) {
            await prisma.laborRecord.update({
                where: { id: laborRecordId },
                data: {
                    status: 'Delivered',
                    deliveryDate: new Date(),
                    deliveryType: statusUpdate // E.g., 'NVD', 'LSCS'
                }
            });
        }

        return NextResponse.json({ birth }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/maternity/birth]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
