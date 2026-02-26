import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
    try {
        const adminEmail = 'admin@realestate.com';
        const adminPassword = 'adminpassword123';
        const adminName = 'System Admin';

        console.log('--- Starting Admin Seeding ---');

        console.log(`Checking if admin with email ${adminEmail} exists...`);
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (existingAdmin) {
            console.log('Admin user already exists. Skipping seeding.');
            return;
        }

        console.log('Hashing admin password...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        console.log('Creating admin user...');
        const admin = await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        console.log('--- Admin Seeding Successful ---');
        console.log('Admin User Created:', {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        });
    } catch (error) {
        console.error('--- Admin Seeding Failed ---');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

seedAdmin();
