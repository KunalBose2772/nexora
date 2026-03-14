const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding Comprehensive Data for Apollo Health Systems...');

    // 1. Get or Create Apollo Tenant
    const apollo = await prisma.tenant.upsert({
        where: { slug: 'apollo' },
        update: {},
        create: {
            tenantCode: 'TEN-9201',
            slug: 'apollo',
            name: 'Apollo Health Systems',
            plan: 'Enterprise Annual',
            status: 'Active',
            adminEmail: 'admin@apollo.com',
            tagline: 'Advanced Healthcare, Delivered with Compassion',
            description: 'Apollo Health Systems is a leading multi-speciality hospital.',
            logoInitials: 'AHS',
            primaryColor: '#0EA5E9',
            phone: '+91 98765 43210',
            address: '14, Medical Hub Road, Bandra West, Mumbai — 400050',
            gstNumber: '27AAACA1234A1Z1',
        },
    });

    const salt = 10;
    const defaultPw = await bcrypt.hash('apollo@123', salt);

    // 2. Create Users
    const staffData = [
        { name: 'Dr. Rajesh Sharma', email: 'dr.sharma@apollo.com', role: 'doctor', dept: 'Cardiology', spec: 'Senior Cardiologist' },
        { name: 'Dr. Sneha Patil', email: 'dr.patil@apollo.com', role: 'doctor', dept: 'Pediatrics', spec: 'Pediatrician' },
        { name: 'Nurse Mary Joseph', email: 'nurse.joseph@apollo.com', role: 'nurse', dept: 'Emergency', spec: 'Senior Nurse' },
        { name: 'Rahul Patel', email: 'pharm.patel@apollo.com', role: 'pharmacist', dept: 'Pharmacy', spec: 'Chief Pharmacist' },
        { name: 'Amit Gupta', email: 'lab.gupta@apollo.com', role: 'lab_tech', dept: 'Laboratory', spec: 'Lab Manager' },
        { name: 'Vikram Singh', email: 'acc.singh@apollo.com', role: 'accountant', dept: 'Accounts', spec: 'Chief Accountant' },
        { name: 'Sanjay Kumar', email: 'admin@apollo.com', role: 'hospital_admin', dept: 'Management', spec: 'Hospital Administrator' },
    ];

    for (const s of staffData) {
        await prisma.user.upsert({
            where: { email: s.email },
            update: { role: s.role }, // Ensure role is correct if update
            create: {
                userId: `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
                name: s.name,
                email: s.email,
                passwordHash: defaultPw,
                role: s.role,
                department: s.dept,
                specialization: s.spec,
                tenantId: apollo.id,
                status: 'Active',
            },
        });
    }

    // 3. Wards & Beds
    const wards = ['Emergency', 'ICU', 'General Ward (Male)', 'General Ward (Female)'];
    for (const wName of wards) {
        const ward = await prisma.ward.create({
            data: {
                name: wName,
                floorWing: wName.includes('Emergency') ? 'Ground Floor, A-Wing' : '2nd Floor, B-Wing',
                tenantId: apollo.id,
            }
        });

        // Add 5 beds to each ward
        for (let i = 1; i <= 5; i++) {
            await prisma.bed.create({
                data: {
                    bedNumber: `${wName.charAt(0)}${i}`,
                    status: i % 2 === 0 ? 'Occupied' : 'Vacant',
                    wardId: ward.id,
                    tenantId: apollo.id,
                }
            });
        }
    }

    // 4. Patients
    const patients = [
        { first: 'Aarav', last: 'Mehta', gender: 'Male', dob: '1985-05-12', phone: '9820012345', email: 'aarav@example.com' },
        { first: 'Ishani', last: 'Sharma', gender: 'Female', dob: '1992-08-22', phone: '9820054321', email: 'ishani@example.com' },
        { first: 'Kabir', last: 'Singh', gender: 'Male', dob: '1978-01-10', phone: '9820099887', email: 'kabir@example.com' },
        { first: 'Ananya', last: 'Iyer', gender: 'Female', dob: '2000-11-30', phone: '9820066554', email: 'ananya@example.com' },
    ];

    const seededPatients = [];
    for (const p of patients) {
        const patient = await prisma.patient.create({
            data: {
                patientCode: `PAT-${Math.floor(Math.random() * 90000) + 10000}`,
                firstName: p.first,
                lastName: p.last,
                gender: p.gender,
                dob: p.dob,
                phone: p.phone,
                email: p.email,
                bloodGroup: 'O+',
                tenantId: apollo.id,
            }
        });
        seededPatients.push(patient);
    }

    // 5. Medicines
    const medicines = [
        { name: 'Paracetamol 500mg', generic: 'Paracetamol', cat: 'Tablet', stock: 500, mrp: 15 },
        { name: 'Amoxicillin 250mg', generic: 'Amoxicillin', cat: 'Capsule', stock: 200, mrp: 45 },
        { name: 'Cetirizine 10mg', generic: 'Cetirizine', cat: 'Tablet', stock: 300, mrp: 8 },
        { name: 'Dolo 650', generic: 'Paracetamol', cat: 'Tablet', stock: 1000, mrp: 30 },
        { name: 'Combiflam', generic: 'Ibuprofen + Paracetamol', cat: 'Tablet', stock: 400, mrp: 25 },
    ];

    for (const m of medicines) {
        await prisma.medicine.create({
            data: {
                drugCode: `DRG-${Math.floor(Math.random() * 9000) + 1000}`,
                name: m.name,
                genericName: m.generic,
                category: m.cat,
                stock: m.stock,
                mrp: m.mrp,
                costPrice: m.mrp * 0.7,
                tenantId: apollo.id,
            }
        });
    }

    // 6. Appointments
    const dateToday = new Date().toISOString().split('T')[0];
    for (let i = 0; i < seededPatients.length; i++) {
        await prisma.appointment.create({
            data: {
                apptCode: `APP-${2024000 + i}`,
                patientName: `${seededPatients[i].firstName} ${seededPatients[i].lastName}`,
                doctorName: i % 2 === 0 ? 'Dr. Rajesh Sharma' : 'Dr. Sneha Patil',
                department: i % 2 === 0 ? 'Cardiology' : 'Pediatrics',
                date: dateToday,
                time: `10:${30 + i * 15}`,
                status: i === 0 ? 'Completed' : 'Scheduled',
                patientId: seededPatients[i].id,
                tenantId: apollo.id,
            }
        });
    }

    // 7. Lab Requests
    const tests = ['CBC', 'Lipid Profile', 'Blood Sugar', 'Thyroid Profile'];
    for (let i = 0; i < tests.length; i++) {
        await prisma.labRequest.create({
            data: {
                trackingId: `LR-${1000 + i}`,
                patientName: `${seededPatients[i].firstName} ${seededPatients[i].lastName}`,
                testName: tests[i],
                category: 'Pathology',
                status: i === 0 ? 'Completed' : 'Pending',
                amount: 500 + i * 150,
                referringDoctor: 'Dr. Rajesh Sharma',
                tenantId: apollo.id,
                patientId: seededPatients[i].id,
            }
        });
    }

    // 8. Invoices
    for (let i = 0; i < seededPatients.length; i++) {
        const amt = 1200 + i * 450;
        await prisma.invoice.create({
            data: {
                invoiceCode: `INV-${2024000 + i}`,
                patientName: `${seededPatients[i].firstName} ${seededPatients[i].lastName}`,
                serviceType: i === 0 ? 'IPD Billing' : 'OPD Consultation',
                amount: amt,
                netAmount: amt,
                status: i % 2 === 0 ? 'Paid' : 'Pending',
                tenantId: apollo.id,
                patientId: seededPatients[i].id,
            }
        });
    }

    // 9. Shifts
    const shifts = [
        { name: 'Morning Shift', start: '08:00', end: '16:00' },
        { name: 'Evening Shift', start: '16:00', end: '00:00' },
        { name: 'Night Shift', start: '00:00', end: '08:00' },
    ];
    for (const sh of shifts) {
        await prisma.shift.create({
            data: {
                name: sh.name,
                startTime: sh.start,
                endTime: sh.end,
                tenantId: apollo.id,
            }
        });
    }

    // 10. Branches
    const branches = [
        { name: 'Apollo Mumbai Main', code: 'B-MUM-01', type: 'Tertiary Care' },
        { name: 'Apollo Navi Mumbai', code: 'B-MUM-02', type: 'Primary Care' },
    ];
    for (const b of branches) {
        await prisma.branch.create({
            data: {
                branchCode: b.code,
                name: b.name,
                facilityType: b.type,
                city: 'Mumbai',
                state: 'Maharashtra',
                status: 'Operational',
                tenantId: apollo.id,
            }
        });
    }

    console.log('✅ Comprehensive seed for Apollo finished!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
