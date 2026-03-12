import prisma from '../utils/prisma';
import bcrypt from 'bcryptjs';

const seed = async () => {
    try {
        console.log('--- Starting Full Seed ---');

        const hashedPassword = await bcrypt.hash('password123', 10);

        // ─── Admin ───────────────────────────────────────────────
        await prisma.user.upsert({
            where: { email: 'admin@hamrorealestate.com' },
            update: {},
            create: {
                name: 'System Admin',
                email: 'admin@hamrorealestate.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('✅ Admin created');

        // ─── Landlords ───────────────────────────────────────────
        const landlord1 = await prisma.user.upsert({
            where: { email: 'rajesh.sharma@gmail.com' },
            update: {},
            create: {
                name: 'Rajesh Sharma',
                email: 'rajesh.sharma@gmail.com',
                password: hashedPassword,
                role: 'LANDLORD',
                isAgent: true,
                agentBio: 'Experienced real estate agent specializing in residential properties in Kathmandu Valley.',
                agentPhone: '+977-9841234567',
                specialty: 'RESIDENTIAL',
            },
        });

        const landlord2 = await prisma.user.upsert({
            where: { email: 'sunita.thapa@gmail.com' },
            update: {},
            create: {
                name: 'Sunita Thapa',
                email: 'sunita.thapa@gmail.com',
                password: hashedPassword,
                role: 'LANDLORD',
                isAgent: true,
                agentBio: 'Luxury property specialist with over 10 years of experience in Kathmandu.',
                agentPhone: '+977-9852345678',
                specialty: 'LUXURY',
            },
        });

        const landlord3 = await prisma.user.upsert({
            where: { email: 'bikash.rai@gmail.com' },
            update: {},
            create: {
                name: 'Bikash Rai',
                email: 'bikash.rai@gmail.com',
                password: hashedPassword,
                role: 'LANDLORD',
                isAgent: false,
            },
        });
        console.log('✅ Landlords created');

        // ─── Tenants ─────────────────────────────────────────────
        await prisma.user.upsert({
            where: { email: 'priya.gurung@gmail.com' },
            update: {},
            create: { name: 'Priya Gurung', email: 'priya.gurung@gmail.com', password: hashedPassword, role: 'TENANT' },
        });
        await prisma.user.upsert({
            where: { email: 'anil.tamang@gmail.com' },
            update: {},
            create: { name: 'Anil Tamang', email: 'anil.tamang@gmail.com', password: hashedPassword, role: 'TENANT' },
        });
        await prisma.user.upsert({
            where: { email: 'sita.maharjan@gmail.com' },
            update: {},
            create: { name: 'Sita Maharjan', email: 'sita.maharjan@gmail.com', password: hashedPassword, role: 'TENANT' },
        });
        console.log('✅ Tenants created');

        // ─── Properties ──────────────────────────────────────────
        const properties = [
            {
                title: 'Modern Apartment in Thamel',
                description: 'Fully furnished 2BHK apartment in the heart of Thamel. Close to restaurants, shops and tourist attractions. 24/7 security and backup power.',
                price: 25000,
                location: 'Thamel, Kathmandu',
                landlordId: landlord1.id,
                listingType: 'RENT' as const,
                propertyType: 'APARTMENT' as const,
                bedrooms: 2,
                bathrooms: 2,
                areaSqFt: 900,
                latitude: 27.7154,
                longitude: 85.3123,
                amenities: { parking: true, wifi: true, security: true, backup_power: true },
                images: [
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Luxury Villa in Budhanilkantha',
                description: 'Stunning 4BHK villa with mountain views in Budhanilkantha. Large garden, private parking, and modern interiors. Perfect for families.',
                price: 120000,
                location: 'Budhanilkantha, Kathmandu',
                landlordId: landlord2.id,
                listingType: 'RENT' as const,
                propertyType: 'HOUSE' as const,
                bedrooms: 4,
                bathrooms: 3,
                areaSqFt: 3200,
                latitude: 27.7833,
                longitude: 85.3667,
                amenities: { parking: true, garden: true, security: true, gym: true },
                images: [
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Commercial Space in New Baneshwor',
                description: 'Prime commercial office space in New Baneshwor business district. Ideal for startups and corporate offices. Open floor plan.',
                price: 80000,
                location: 'New Baneshwor, Kathmandu',
                landlordId: landlord1.id,
                listingType: 'RENT' as const,
                propertyType: 'COMMERCIAL' as const,
                bedrooms: 0,
                bathrooms: 2,
                areaSqFt: 1500,
                latitude: 27.6933,
                longitude: 85.3414,
                amenities: { parking: true, wifi: true, elevator: true },
                images: [
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Cozy Studio in Lalitpur',
                description: 'Affordable studio apartment in Lalitpur (Patan). Walking distance to Patan Durbar Square. Ideal for students and young professionals.',
                price: 12000,
                location: 'Lalitpur, Patan',
                landlordId: landlord3.id,
                listingType: 'RENT' as const,
                propertyType: 'APARTMENT' as const,
                bedrooms: 1,
                bathrooms: 1,
                areaSqFt: 450,
                latitude: 27.6674,
                longitude: 85.3240,
                amenities: { wifi: true, water: true },
                images: [
                    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: '3BHK House for Sale in Bhaktapur',
                description: 'Beautiful 3BHK house for sale in the heritage city of Bhaktapur. Traditional Newari architecture with modern amenities. Quiet neighborhood.',
                price: 8500000,
                location: 'Bhaktapur, Kathmandu Valley',
                landlordId: landlord2.id,
                listingType: 'SALE' as const,
                propertyType: 'HOUSE' as const,
                bedrooms: 3,
                bathrooms: 2,
                areaSqFt: 1800,
                latitude: 27.6722,
                longitude: 85.4298,
                amenities: { parking: true, garden: true, water: true },
                images: [
                    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Land for Sale in Godavari',
                description: 'Prime residential land in the scenic Godavari area. Peaceful environment with easy road access. Suitable for building a dream home.',
                price: 15000000,
                location: 'Godavari, Lalitpur',
                landlordId: landlord3.id,
                listingType: 'SALE' as const,
                propertyType: 'LAND' as const,
                bedrooms: 0,
                bathrooms: 0,
                areaSqFt: 5000,
                latitude: 27.5964,
                longitude: 85.3819,
                amenities: { road_access: true, water: true },
                images: [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Penthouse in Jhamsikhel',
                description: 'Exclusive penthouse with panoramic city and Himalayan views. Top floor of a premium building in upscale Jhamsikhel. Rooftop terrace included.',
                price: 75000,
                location: 'Jhamsikhel, Lalitpur',
                landlordId: landlord2.id,
                listingType: 'RENT' as const,
                propertyType: 'APARTMENT' as const,
                bedrooms: 3,
                bathrooms: 3,
                areaSqFt: 2200,
                latitude: 27.6797,
                longitude: 85.3182,
                amenities: { parking: true, rooftop: true, security: true, gym: true, wifi: true },
                images: [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Affordable Flat in Kirtipur',
                description: 'Budget-friendly 2BHK flat in Kirtipur near Tribhuvan University. Great for students and faculty. Quiet residential area with good transport links.',
                price: 10000,
                location: 'Kirtipur, Kathmandu',
                landlordId: landlord1.id,
                listingType: 'RENT' as const,
                propertyType: 'APARTMENT' as const,
                bedrooms: 2,
                bathrooms: 1,
                areaSqFt: 700,
                latitude: 27.6778,
                longitude: 85.2786,
                amenities: { water: true, parking: false },
                images: [
                    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Modern Office in Durbar Marg',
                description: "Prestigious office space on Durbar Marg, Kathmandu's prime business street. Fully equipped with modern facilities. Excellent location for corporate offices.",
                price: 150000,
                location: 'Durbar Marg, Kathmandu',
                landlordId: landlord2.id,
                listingType: 'RENT' as const,
                propertyType: 'COMMERCIAL' as const,
                bedrooms: 0,
                bathrooms: 3,
                areaSqFt: 2500,
                latitude: 27.7103,
                longitude: 85.3157,
                amenities: { parking: true, elevator: true, security: true, wifi: true, backup_power: true },
                images: [
                    'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=800&auto=format&fit=crop',
                ],
            },
            {
                title: 'Family Home in Baluwatar',
                description: 'Spacious 4BHK family home in the prestigious Baluwatar area. Close to embassies and international schools. Large garden and garage.',
                price: 12000000,
                location: 'Baluwatar, Kathmandu',
                landlordId: landlord1.id,
                listingType: 'SALE' as const,
                propertyType: 'HOUSE' as const,
                bedrooms: 4,
                bathrooms: 4,
                areaSqFt: 4000,
                latitude: 27.7267,
                longitude: 85.3267,
                amenities: { parking: true, garden: true, security: true, backup_power: true },
                images: [
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop',
                ],
            },
        ];

        for (const property of properties) {
            await prisma.property.create({ data: property });
        }
        console.log('✅ 10 Properties with images created');

        console.log('\n--- Seed Complete! 🎉 ---');
        console.log('All passwords: password123');
        console.log('Admin:     admin@hamrorealestate.com');
        console.log('Landlord1: rajesh.sharma@gmail.com');
        console.log('Landlord2: sunita.thapa@gmail.com');
        console.log('Landlord3: bikash.rai@gmail.com');
        console.log('Tenant1:   priya.gurung@gmail.com');
        console.log('Tenant2:   anil.tamang@gmail.com');
        console.log('Tenant3:   sita.maharjan@gmail.com');

    } catch (error) {
        console.error('--- Seed Failed ---');
        console.error(error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

seed();