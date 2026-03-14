import prisma from './prisma';

/**
 * createSystemNotification
 * Creates a persistent alert in the hospital's dashboard for staff.
 */
export async function createSystemNotification({ tenantId, text, type = 'info', category = 'System' }) {
    try {
        const notif = await prisma.notification.create({
            data: {
                tenantId,
                text,
                type,
                category
            }
        });
        return notif;
    } catch (e) {
        console.error("Failed to create system notification:", e);
        return null;
    }
}

/**
 * sendExternalMessage
 * Dispatches an SMS/WhatsApp/Email to a patient or doctor.
 * Tracks the delivery status in CommunicationLog.
 * @param {string} channel - 'SMS' | 'WhatsApp' | 'Email'
 */
export async function sendExternalMessage({ 
    tenantId, 
    recipientName, 
    recipientPhone, 
    channel, 
    type, 
    message 
}) {
    try {
        // 1. Initial log entry in "Pending" status
        const log = await prisma.communicationLog.create({
            data: {
                tenantId,
                recipientName,
                recipientPhone,
                channel,
                type,
                message,
                status: 'Pending'
            }
        });

        // 2. Mocking the external API call (Twilio / WhatsApp Business API / SendGrid)
        console.log(`[EXTERNAL_COMM] Sending ${channel} to ${recipientPhone} (${recipientName}): "${message}"`);
        
        // Simulating 500ms API latency
        await new Promise(r => setTimeout(r, 100));

        // 3. Update status to "Sent" (In real life, we'd wait for webhook delivery callbacks for "Delivered")
        const updated = await prisma.communicationLog.update({
            where: { id: log.id },
            data: { status: 'Sent', providerId: `MOCK_${Date.now()}` }
        });

        return updated;
    } catch (e) {
        console.error("Failed to send external message:", e);
        return null;
    }
}

/**
 * TRIGGER ANALYTICS: Auto-discovery logic (to be run via CRON or specific page loads)
 * Finds low stock and creates notifications if they don't already exist for today.
 */
export async function checkInventoryThresholds(tenantId) {
    const lowStock = await prisma.medicine.findMany({
        where: { tenantId, stock: { lt: prisma.medicine.fields.minThreshold } }
    });

    for (const med of lowStock) {
        const today = new Date();
        today.setHours(0,0,0,0);

        // Check if we already alerted today
        const existing = await prisma.notification.findFirst({
            where: {
                tenantId,
                text: { contains: med.name },
                createdAt: { gte: today }
            }
        });

        if (!existing) {
            await createSystemNotification({
                tenantId,
                text: `Critical stock alert for ${med.name}. Current qty: ${med.stock}.`,
                type: 'error',
                category: 'Inventory'
            });
        }
    }
}
