const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error('No tenant');
  
  const tenantId = tenant.id;
  console.log('Using Tenant ID: ' + tenantId);
  
  const patients = [
    { name: 'Sarah Mitchell', code: 'ER- Mitchell-' + Date.now(), triage: 1, vitals: { bp: '90/60', hr: '120', temp: '98.6', spo2: '88', rr: '28' }, notes: 'Severe respiratory distress, suspected anaphylaxis. Intubation kit on standby.', trauma: 'Medical / Respiratory' },
    { name: 'John Doe (Unidentified)', code: 'ER-TRAUMA-' + Date.now(), triage: 1, vitals: { bp: '80/40', hr: '135', temp: '97.2', spo2: '92', rr: '32' }, notes: 'Multiple trauma from RTA. Active internal bleeding suspected. FAST scan positive.', trauma: 'RTA / High Impact' },
    { name: 'Robert Wilson', code: 'ER- Wilson-' + Date.now(), triage: 2, vitals: { bp: '160/100', hr: '95', temp: '99.1', spo2: '96', rr: '20' }, notes: 'Crushing chest pain radiating to left arm. History of HTN.', trauma: 'Cardiac / Chest Pain' },
    { name: 'Elena Rodriguez', code: 'ER- Rodriguez-' + Date.now(), triage: 3, vitals: { bp: '120/80', hr: '80', temp: '102.5', spo2: '98', rr: '18' }, notes: 'Generalized abdominal pain, localized to RLQ. Positive rebound tenderness.', trauma: 'Surgical / Abdominal' },
    { name: 'David Chen', code: 'ER- Chen-' + Date.now(), triage: 4, vitals: { bp: '130/85', hr: '72', temp: '98.4', spo2: '99', rr: '16' }, notes: 'Laceration on right forearm from workshop accident. Bleeding controlled.', trauma: 'Minor Trauma' }
  ];

  for (const p of patients) {
    try {
      await prisma.appointment.create({
        data: {
          apptCode: p.code,
          patientName: p.name,
          doctorName: 'ER Physician On-Call',
          type: 'EMERGENCY',
          status: 'Active',
          triageLevel: p.triage,
          triageVitals: JSON.stringify(p.vitals),
          admitNotes: p.notes,
          traumaType: p.trauma,
          tenantId: tenantId,
          date: new Date().toISOString().split('T')[0]
        }
      });
      console.log('Created: ' + p.name);
    } catch (err) {
      console.error('Failed to create ' + p.name + ': ' + err.message);
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
