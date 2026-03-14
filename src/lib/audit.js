import prisma from './prisma';

/**
 * Logs an action to the AuditLog table for enterprise-grade tracking.
 * @param {Object} params - The log details
 */
export async function logAudit({ 
    session, 
    action, 
    resource, 
    resourceId = null, 
    description = null, 
    oldValue = null, 
    newValue = null,
    req = null 
}) {
    try {
        if (!session || !session.tenantId) return;

        let ipAddress = null;
        let userAgent = null;

        if (req) {
            ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
            userAgent = req.headers.get('user-agent') || 'Unknown';
        }

        await prisma.auditLog.create({
            data: {
                action,
                resource,
                resourceId,
                description,
                oldValue: oldValue ? JSON.stringify(oldValue) : null,
                newValue: newValue ? JSON.stringify(newValue) : null,
                userId: session.id || session.userId,
                userName: session.name,
                userRole: session.role,
                ipAddress,
                userAgent,
                tenantId: session.tenantId
            }
        });
    } catch (error) {
        console.error('Audit Logging Failed:', error);
    }
}
