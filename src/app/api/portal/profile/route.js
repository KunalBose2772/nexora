import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSessionFromRequest } from '@/lib/auth';

export async function PATCH(req) {
    try {
        const session = await getSessionFromRequest(req);
        if (!session || session.role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { currentPassword, newPassword, firstName, lastName, phone } = await req.json();

        const patient = await prisma.patient.findUnique({
            where: { id: session.id }
        });

        if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

        let updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone) updateData.phone = phone;

        if (newPassword) {
            if (!currentPassword) return NextResponse.json({ error: 'Current password is required to change password' }, { status: 400 });
            const valid = await bcrypt.compare(currentPassword, patient.passwordHash);
            if (!valid) return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
            updateData.passwordHash = await bcrypt.hash(newPassword, 10);
        }

        const updated = await prisma.patient.update({
            where: { id: session.id },
            data: updateData
        });

        return NextResponse.json({ ok: true, patient: { firstName: updated.firstName, lastName: updated.lastName, phone: updated.phone } });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
