const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('🌱 Starting seeding...');

    const passwordHash = await bcrypt.hash('password123', 10);
    const AdminPasswordHash = await bcrypt.hash('Inspire@768', 10);

    // 1. Admin User
    const admin = await prisma.user.upsert({
        where: { email: 'admin@stratiara.com' },
        update: { role: 'ADMIN', approvalStatus: 'APPROVED' },
        create: {
            email: 'admin@stratiara.com',
            name: 'Admin User',
            passwordHash: AdminPasswordHash,
            role: 'ADMIN',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Admin user seeded: admin@stratiara.com');

    // 2. Tester User
    const tester = await prisma.user.upsert({
        where: { email: 'tester@stratiara.com' },
        update: { role: 'TESTER', approvalStatus: 'APPROVED' },
        create: {
            email: 'tester@stratiara.com',
            name: 'Tester User',
            passwordHash,
            role: 'TESTER',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Tester user seeded: tester@stratiara.com');

    // 3. Regular User
    const user = await prisma.user.upsert({
        where: { email: 'user@stratiara.com' },
        update: { role: 'USER', approvalStatus: 'APPROVED' },
        create: {
            email: 'user@stratiara.com',
            name: 'Regular User',
            passwordHash,
            role: 'USER',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Regular user seeded: user@stratiara.com');

    // 4. Enterprise User
    const enterprise = await prisma.user.upsert({
        where: { email: 'enterprise@stratiara.com' },
        update: { role: 'ENTERPRISE', approvalStatus: 'APPROVED' },
        create: {
            email: 'enterprise@stratiara.com',
            name: 'Enterprise User',
            passwordHash,
            role: 'ENTERPRISE',
            approvalStatus: 'APPROVED',
            preferences: {},
        },
    });
    console.log('👤 Enterprise user seeded: enterprise@stratiara.com');

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
