const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        console.log('Testing database connection...');

        // Test connection
        await prisma.$connect();
        console.log('✓ Database connection successful!');

        // Check for users
        const users = await prisma.user.findMany();
        console.log(`\nFound ${users.length} user(s) in database:`);
        users.forEach(user => {
            console.log(`  - Email: ${user.email}, Name: ${user.name || 'N/A'}`);
        });

        if (users.length === 0) {
            console.log('\n⚠ No users found in database. You need to create a user first.');
        }

    } catch (error) {
        console.error('❌ Database error:', error.message);
        if (error.code === 'P1001') {
            console.error('\nConnection failed. Please check:');
            console.error('1. MongoDB connection string in .env file');
            console.error('2. Network connectivity');
            console.error('3. MongoDB Atlas IP whitelist settings');
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
