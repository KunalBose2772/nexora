import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Retrieve all active, admitted IPD patients
        const patients = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId, type: 'IPD', status: 'Admitted' },
            orderBy: [{ ward: 'asc' }, { bed: 'asc' }]
        });

        // Retrieve all nursing logs (vitals and medications).
        // Safely injected into the Appointment DB using type="NursingLog" with the IPD Appt ID linked in `department`.
        const logs = await prisma.appointment.findMany({
            where: { tenantId: session.tenantId, type: 'NursingLog' },
            orderBy: [{ createdAt: 'desc' }]
        });

        return NextResponse.json({ patients, logs });
    } catch (e) {
        console.error('Nursing GET Error', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();

        const newLog = await prisma.appointment.create({
            data: {
                tenantId: session.tenantId,
                apptCode: `NLG-${Math.floor(10000 + Math.random() * 90000)}`,
                patientName: data.logType, // either 'Vitals' or 'Medication'
                doctorName: data.nurseName,
                department: data.ipdId, // Foreign Key linking back to the specific IPD Admission
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false }).substring(0, 5),
                type: 'NursingLog',
                status: 'Completed',
                admitNotes: data.value // Stores formatting strings like "BP:120/80 | HR:72"
            }
        });

        return NextResponse.json({ message: 'Log Appended', log: newLog }, { status: 201 });
    } catch (e) {
        console.error('Nursing POST Error', e);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
