const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Common password for both accounts
    const commonPassword = await bcrypt.hash('nigga2548', 10);

    // Admin
    await prisma.user.upsert({
        where: { studentId: 'admin' },
        update: {
            passwordHash: commonPassword, // Update password if exists
        },
        create: {
            studentId: 'admin',
            passwordHash: commonPassword,
            role: 'admin',
            pin: '0000'
        },
    });

    // Student (B6701970)
    await prisma.user.upsert({
        where: { studentId: 'B6701970' }, // Standardize to Uppercase for ID
        update: {
            passwordHash: commonPassword, // Update password if exists
        },
        create: {
            studentId: 'B6701970',
            passwordHash: commonPassword,
            role: 'student',
            pin: '1234'
        },
    });

    console.log('Seeding finished. Passwords updated.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
