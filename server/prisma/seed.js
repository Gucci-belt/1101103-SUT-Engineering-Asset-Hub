const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);
    const studentPassword = await bcrypt.hash('12345678', 10); // Standard password

    // Admin
    await prisma.user.upsert({
        where: { studentId: 'admin' },
        update: {},
        create: {
            studentId: 'admin',
            passwordHash: password,
            role: 'admin',
            pin: '0000'
        },
    });

    // Student (B6701970)
    await prisma.user.upsert({
        where: { studentId: 'B6701970' },
        update: {},
        create: {
            studentId: 'B6701970',
            passwordHash: studentPassword,
            role: 'student',
            pin: '1234'
        },
    });

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
