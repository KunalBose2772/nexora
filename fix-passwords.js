const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fixPasswords() {
    const users = await prisma.user.findMany();
    let fixedCount = 0;

    for (const user of users) {
        if (!user.passwordHash.startsWith('$2a$') && !user.passwordHash.startsWith('$2b$')) {
            // It's a base64 string. Decode it back to the plain text password.
            const plainPassword = Buffer.from(user.passwordHash, 'base64').toString('ascii');
            const newHash = await bcrypt.hash(plainPassword, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: newHash }
            });
            console.log(`Fixed password hash for user: ${user.email} (was base64, now bcrypt)`);
            fixedCount++;
        }
    }
    console.log(`Done. Fixed ${fixedCount} users.`);
}

fixPasswords()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
