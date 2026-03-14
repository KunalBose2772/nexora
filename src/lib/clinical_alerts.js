import { createSystemNotification, sendExternalMessage } from './notifications';
import prisma from './prisma';

/**
 * Panic Ranges for Common Tests
 */
const CRITICAL_THRESHOLDS = {
    'HEMOGLOBIN (HB)': { min: 7.0, max: 20.0, msg: "Critically low Hb detected! Transfusion may be required." },
    'WBC COUNT': { min: 4.0, max: 30.0, msg: "Severe leukocytosis! Significant infection alert." },
    'TROPONIN': { min: null, max: 0.1, msg: "Cardiac Troponin elevated! Potential MI alert." },
    'BLOOD GLUCOSE': { min: 50, max: 400, msg: "Critical Glycemic Alert! Patient at risk of coma/shock." },
    'POTASSIUM': { min: 2.5, max: 6.5, msg: "Critical Electrolyte Imbalance (Potassium)!" }
};

/**
 * analyzeLabResults
 * Scans a JSON of test results and detects panic values.
 */
export async function analyzeLabResults({ tenantId, patientName, testName, results }) {
    if (!results) return;

    try {
        const findings = typeof results === 'string' ? JSON.parse(results) : results;
        let alarms = [];

        // Loop through the findings and compare with thresholds
        for (const [parameter, value] of Object.entries(findings)) {
            const upParam = parameter.toUpperCase();
            const numVal = parseFloat(value);

            if (isNaN(numVal)) continue;

            const threshold = CRITICAL_THRESHOLDS[upParam];
            if (threshold) {
                if ((threshold.min !== null && numVal < threshold.min) || 
                    (threshold.max !== null && numVal > threshold.max)) {
                    alarms.push({ parameter, value, message: threshold.msg });
                }
            }
        }

        // If any alarms detected, trigger high-priority events
        for (const alarm of alarms) {
            console.log(`[CLINICAL_ALARM] Critical finding for ${patientName}: ${alarm.parameter} = ${alarm.value}`);

            // 1. Dashboard Notification (Emergency Red)
            await createSystemNotification({
                tenantId,
                text: `CRITICAL ALARM: ${patientName} - ${alarm.message}`,
                type: 'error',
                category: 'Clinical'
            });

            // 2. Fetch the attending doctor's phone/email for high-priority dispatch
            // We search for recent appointments to find the consultant
            const appt = await prisma.appointment.findFirst({
                where: { tenantId, patientName, status: 'Admitted' },
                orderBy: { createdAt: 'desc' }
            });

            if (appt && appt.doctorName) {
                // In a production system, we'd fetch the User record for the doctor to get their real phone number.
                // For this demo, we mock it.
                await sendExternalMessage({
                    tenantId,
                    recipientName: `Dr. ${appt.doctorName}`,
                    recipientPhone: '91-DOCTOR-SOS',
                    channel: 'SMS',
                    type: 'Critical Lab Alarm',
                    message: `EMERGENCY ALERT: Your patient ${patientName} has a critical ${alarm.parameter} value of ${alarm.value}. Please review LAB-REQUEST for ${testName}.`
                });
            }
        }

        return alarms;
    } catch (e) {
        console.error("Clinical Analysis Error:", e);
        return [];
    }
}
