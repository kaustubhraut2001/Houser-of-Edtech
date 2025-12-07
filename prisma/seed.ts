import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  console.log('Created user:', user.email);

  // Helper function to create slug from name
  const slugify = (text: string) => 
    text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-')           // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text

  // Create categories
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { 
      name: 'Electronics',
      slug: 'electronics'
    },
  });

  const furniture = await prisma.category.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: { 
      name: 'Furniture',
      slug: 'furniture'
    },
  });

  const clothing = await prisma.category.upsert({
    where: { name: 'Clothing' },
    update: {},
    create: { 
      name: 'Clothing',
      slug: 'clothing'
    },
  });

  console.log('Created categories');

  // Create sample products
  const products = [
    {
      name: 'Laptop',
      description: 'High-performance laptop for professionals',
      price: 1299.99,
      stock: 15,
      categoryId: electronics.id,
    },
    {
      name: 'Office Chair',
      description: 'Ergonomic office chair with lumbar support',
      price: 349.99,
      stock: 8,
      categoryId: furniture.id,
    },
    {
      name: 'T-Shirt',
      description: 'Cotton casual t-shirt',
      price: 29.99,
      stock: 50,
      categoryId: clothing.id,
    },
    {
      name: 'Wireless Mouse',
      description: 'Bluetooth wireless mouse with rechargeable battery',
      price: 49.99,
      stock: 25,
      categoryId: electronics.id,
    },
    {
      name: 'Desk Lamp',
      description: 'LED desk lamp with adjustable brightness',
      price: 39.99,
      stock: 12,
      categoryId: furniture.id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Created sample products');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
