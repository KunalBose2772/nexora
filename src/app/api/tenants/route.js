import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(request) {
    const session = await getSessionFromRequest(request);
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                _count: {
                    select: { patients: true, users: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json({ tenants });
    } catch (error) {
        console.error('Error fetching tenants:', error);
        return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getSessionFromRequest(request);
    if (!session || session.role !== 'superadmin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, slug, plan, adminEmail } = body;

        if (!name || !slug || !adminEmail) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingSlug = await prisma.tenant.findUnique({ where: { slug } });
        if (existingSlug) {
            return NextResponse.json({ error: 'Slug is already in use' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (existingUser) {
            return NextResponse.json({ error: 'Email is already in use' }, { status: 400 });
        }

        const tenantCode = 'HOSP-' + Math.floor(1000 + Math.random() * 9000);
        const tempPassword = Math.random().toString(36).slice(-8);
        const passwordHash = await bcrypt.hash(tempPassword, 10);
        const userId = 'ADM-' + Math.floor(10000 + Math.random() * 90000);

        const newTenant = await prisma.tenant.create({
            data: {
                name,
                slug,
                plan: plan || 'Starter Tier',
                adminEmail,
                tenantCode,
                status: 'Active',
                users: {
                    create: {
                        userId,
                        name: 'System Admin',
                        email: adminEmail,
                        passwordHash,
                        role: 'hospital_admin',
                        status: 'Active'
                    }
                }
            }
        });

        return NextResponse.json({ 
            tenant: newTenant,
            credentials: { email: adminEmail, tempPassword }
        });
    } catch (error) {
        console.error('Error creating tenant:', error);
        return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 });
    }
}
