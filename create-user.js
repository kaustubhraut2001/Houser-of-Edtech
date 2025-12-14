const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createUser() {
    try {
        console.log('Creating test user...');

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin@example.com' }
        });

        if (existingUser) {
            console.log('✓ User already exists: admin@example.com');
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                email: 'admin@example.com',
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✓ User created successfully!');
        console.log('  Email: admin@example.com');
        console.log('  Password: password123');
        console.log('\nYou can now login with these credentials.');

    } catch (error) {
        console.error('❌ Error creating user:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

createUser();
