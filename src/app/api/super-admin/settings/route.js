import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        let setting = await prisma.platformSetting.findUnique({
            where: { id: 'global' }
        });

        if (!setting) {
            // Default mock settings
            setting = await prisma.platformSetting.create({
                data: {
                    id: 'global',
                    data: JSON.stringify({
                        generalSettings: { name: 'Nexora Health SaaS', email: 'support@globalwebify.com', currency: 'INR (₹)', allowSignups: true },
                        security: { mfa: true, strictPass: true, timeout: 60 },
                        infra: { region: 'ap-south-1 (Mumbai)', bucket: 'nexora-tenant-storage-prod-ap-south' },
                        db: { maxTenants: 250, isolation: 'Pool-based (Logical Separation)' },
                        keys: { stripe: 'sk_live_123456789', twilio: 'AC123xyz', sendgrid: 'SG.xyz.123' }
                    })
                }
            });
        }

        return NextResponse.json({ ok: true, settings: JSON.parse(setting.data) });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to load settings.', detail: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSessionFromRequest(request);
        if (!session || session.role !== 'superadmin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await request.json();

        const setting = await prisma.platformSetting.upsert({
            where: { id: 'global' },
            create: {
                id: 'global',
                data: JSON.stringify(data)
            },
            update: {
                data: JSON.stringify(data)
            }
        });

        await prisma.systemLog.create({
            data: {
                title: 'Platform Settings Updated',
                description: `Global platform settings were modified.`,
                type: 'info'
            }
        });

        return NextResponse.json({ ok: true, settings: JSON.parse(setting.data) });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to save settings.', detail: err.message }, { status: 500 });
    }
}
