const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedRecords() {
    try {
        const patients = await prisma.patient.findMany({ take: 5 });
        if (patients.length === 0) {
            console.log("No patients found. Please register some patients first.");
            return;
        }

        const categories = ['Pathology', 'Radiology', 'Discharge', 'Prescription'];
        const titles = [
            'Complete Blood Count (CBC) - Analysis',
            'Chest X-Ray Digital Image',
            'Pre-Op Clinical Clearance',
            'Cardiology Consultation Summary',
            'Final Discharge Summary - Surgery'
        ];

        for (const pt of patients) {
            // Create 2 records per patient
            for (let i = 0; i < 2; i++) {
                await prisma.patientRecord.create({
                    data: {
                        tenantId: pt.tenantId,
                        patientId: pt.id,
                        categoryTag: categories[Math.floor(Math.random() * categories.length)],
                        title: titles[Math.floor(Math.random() * titles.length)],
                        date: new Date().toISOString().split('T')[0],
                        fileUrl: '/uploads/sample-report.pdf'
                    }
                });
            }
            console.log(`Archived 2 clinical records for patient ${pt.patientCode}`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

seedRecords();
