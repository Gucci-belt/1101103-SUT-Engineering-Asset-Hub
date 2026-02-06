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

    // Student (b6701970)
    await prisma.user.upsert({
        where: { studentId: 'b6701970' }, // Lowercase
        update: {
            passwordHash: commonPassword,
            pin: '1234'
        },
        create: {
            studentId: 'b6701970',
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
