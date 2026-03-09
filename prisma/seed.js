const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('🌱 Starting seeding...');

    const passwordHash = await bcrypt.hash('password123', 10);

    // 1. Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: { role: 'ADMIN', approvalStatus: 'APPROVED' },
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            passwordHash,
            role: 'ADMIN',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Admin user seeded: admin@example.com');

    // 2. Tester User
    const tester = await prisma.user.upsert({
        where: { email: 'tester@example.com' },
        update: { role: 'TESTER', approvalStatus: 'APPROVED' },
        create: {
            email: 'tester@example.com',
            name: 'Tester User',
            passwordHash,
            role: 'TESTER',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Tester user seeded: tester@example.com');

    // 3. Regular User
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: { role: 'USER', approvalStatus: 'APPROVED' },
        create: {
            email: 'user@example.com',
            name: 'Regular User',
            passwordHash,
            role: 'USER',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Regular user seeded: user@example.com');

    // 4. Enterprise User
    const enterprise = await prisma.user.upsert({
        where: { email: 'enterprise@example.com' },
        update: { role: 'ENTERPRISE', approvalStatus: 'APPROVED' },
        create: {
            email: 'enterprise@example.com',
            name: 'Enterprise User',
            passwordHash,
            role: 'ENTERPRISE',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Enterprise user seeded: enterprise@example.com');

    console.log('✅ Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
