import prisma from './src/utils/prisma';

async function main() {
    try {
        const userCount = await prisma.user.count();
        console.log(`Prisma connected! User count: ${userCount}`);

        // Check if message model exists at runtime
        if ('message' in prisma) {
            console.log("Message model found on prisma instance!");
        } else {
            console.log("Message model NOT found on prisma instance.");
        }
    } catch (error) {
        console.error("Prisma runtime error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
