import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const donations = await prisma.bloodDonation.findMany({
            where: { tenantId: session.tenantId },
            include: { donor: true, stock: true },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ donations }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/blood-bank/donations]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const donationCode = `DN-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // 1. Create Donation Record
        const donation = await prisma.bloodDonation.create({
            data: {
                ...body,
                unitsCollected: parseInt(body.unitsCollected || 1),
                donationCode,
                tenantId: session.tenantId
            }
        });

        // 2. If Fit for Donation, Add to Stock Automatically
        if (body.fitForDonation) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 35); // Standard 35 days for whole blood

            await prisma.bloodStock.create({
                data: {
                    bloodGroup: body.bloodGroup,
                    units: parseInt(body.unitsCollected || 1),
                    expiryDate,
                    source: 'In-House Donation',
                    donationId: donation.id,
                    tenantId: session.tenantId
                }
            });
        }

        // 3. Update Donor's Last Donation Date
        await prisma.bloodDonor.update({
            where: { id: body.donorId },
            data: { lastDonationAt: new Date() }
        });

        return NextResponse.json({ donation }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/blood-bank/donations]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
