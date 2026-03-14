import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Polymorphic use of Appointment table to track hospital machinery without migrating DB schema
        const assets = await prisma.appointment.findMany({
            where: {
                tenantId: session.tenantId,
                type: 'BiomedicalAsset',
            },
            orderBy: { date: 'asc' }
        });

        // Compute maintenance alerts (due within 30 days)
        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const summary = {
            total: assets.length,
            active: assets.filter(a => a.status === 'Active').length,
            maintenance: assets.filter(a => a.status === 'In Maintenance').length,
            alerts: assets.filter(a => {
                if (!a.time) return false;
                const nextDate = new Date(a.time);
                return nextDate <= thirtyDaysFromNow;
            }).length
        };

        return NextResponse.json({ assets, summary });
    } catch (e) {
        console.error('Biomed GET Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        // Storing Asset Data mapped optimally to Appointment columns
        const newAsset = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode: `AST-${Math.floor(100000 + Math.random() * 900000)}`,
                patientName: data.assetName, // Name of Asset e.g., '1.5T MRI Scanner'
                doctorName: data.serialNumber, // Model/Serial Number
                department: data.department, // Radiology, ICU, etc
                date: data.lastCalibrationDate, // YYYY-MM-DD
                time: data.nextCalibrationDate, // Storing Next Calib Date as a date string inside `time`
                type: 'BiomedicalAsset',
                status: 'Active',
                admitNotes: `[VENDOR] ${data.vendorName} | [CONTACT] ${data.vendorContact}`
            }
        });

        return NextResponse.json({ message: 'Asset Tracked', asset: newAsset }, { status: 201 });
    } catch (e) {
        console.error('Biomed POST Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id, status } = await req.json();

        // Used primarily to toggle machinery from Active to 'In Maintenance'
        await prisma.appointment.update({
            where: { id, tenantId: session.tenantId },
            data: { status }
        });

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('Biomed PUT Error:', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
