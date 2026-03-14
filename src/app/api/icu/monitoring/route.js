import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || !session.tenantId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const appointmentId = searchParams.get('appointmentId');

        if (!appointmentId) {
            return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
        }

        const history = await prisma.icuMonitoring.findMany({
            where: {
                appointmentId,
                tenantId: session.tenantId
            },
            orderBy: { recordedAt: 'desc' },
            take: 24 // Last 24 hours / entries
        });

        return NextResponse.json({ history }, { status: 200 });
    } catch (err) {
        console.error('[GET /api/icu/monitoring]', err);
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
        const {
            appointmentId, heartRate, systolicBP, diastolicBP, spo2, temp, respRate,
            isVentilated, ventMode, fiO2, peep, tidalVolume, pip,
            intakeTotal, outputTotal, infusions
        } = body;

        if (!appointmentId) {
            return NextResponse.json({ error: 'Appointment ID required' }, { status: 400 });
        }

        const entry = await prisma.icuMonitoring.create({
            data: {
                appointmentId,
                tenantId: session.tenantId,
                recordedBy: session.userName || 'System',
                heartRate: heartRate ? parseInt(heartRate) : null,
                systolicBP: systolicBP ? parseInt(systolicBP) : null,
                diastolicBP: diastolicBP ? parseInt(diastolicBP) : null,
                spo2: spo2 ? parseInt(spo2) : null,
                temp: temp ? parseFloat(temp) : null,
                respRate: respRate ? parseInt(respRate) : null,
                isVentilated: !!isVentilated,
                ventMode: ventMode,
                fiO2: fiO2 ? parseFloat(fiO2) : null,
                peep: peep ? parseFloat(peep) : null,
                tidalVolume: tidalVolume ? parseInt(tidalVolume) : null,
                pip: pip ? parseFloat(pip) : null,
                intakeTotal: intakeTotal ? parseFloat(intakeTotal) : null,
                outputTotal: outputTotal ? parseFloat(outputTotal) : null,
                balance: (parseFloat(intakeTotal || 0) - parseFloat(outputTotal || 0)),
                infusions: typeof infusions === 'string' ? infusions : JSON.stringify(infusions)
            }
        });

        // CRITICAL VITALS ALARM
        const spo2Val = spo2 ? parseInt(spo2) : 100;
        const sbpVal = systolicBP ? parseInt(systolicBP) : 120;

        if (spo2Val < 90 || sbpVal < 90) {
            const apt = await prisma.appointment.findUnique({
                where: { id: appointmentId },
                include: { patient: true }
            });

            await prisma.notification.create({
                data: {
                    tenantId: session.tenantId,
                    text: `ALERT: Critical vitals for ${apt?.patientName} (${apt?.patient?.patientCode || 'IPD'}). SPO2: ${spo2Val}%, SBP: ${sbpVal}mmHg. Immediate review required!`,
                    type: 'error',
                    category: 'Clinical'
                }
            });
        }

        return NextResponse.json({ entry }, { status: 201 });
    } catch (err) {
        console.error('[POST /api/icu/monitoring]', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
