'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export interface ProductFormData {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId?: string;
}

export async function getProducts(search?: string) {
    try {
        const products = await prisma.product.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : undefined,
            include: {
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: 'Failed to fetch products' };
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        return { success: true, data: product };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: 'Failed to fetch product' };
    }
}

export async function createProduct(data: ProductFormData) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: new Prisma.Decimal(data.price),
                stock: data.stock,
                categoryId: data.categoryId || null,
            },
        });
        revalidatePath('/dashboard/products');
        return { success: true, data: product };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Failed to create product' };
    }
}

export async function updateProduct(id: string, data: ProductFormData) {
    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: new Prisma.Decimal(data.price),
                stock: data.stock,
                categoryId: data.categoryId || null,
            },
        });
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard');
        return { success: true, data: product };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        });
        revalidatePath('/dashboard/products');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}

export async function getLowStockProducts(threshold: number = 10) {
    try {
        const products = await prisma.product.findMany({
            where: {
                stock: {
                    lte: threshold,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                stock: 'asc',
            },
        });
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching low stock products:', error);
        return { success: false, error: 'Failed to fetch low stock products' };
    }
}

export async function getProductStats() {
    try {
        const totalProducts = await prisma.product.count();
        const lowStockCount = await prisma.product.count({
            where: { stock: { lte: 10 } },
        });
        const totalValue = await prisma.product.aggregate({
            _sum: {
                stock: true,
            },
        });

        return {
            success: true,
            data: {
                totalProducts,
                lowStockCount,
                totalItems: totalValue._sum.stock || 0,
            },
        };
    } catch (error) {
        console.error('Error fetching product stats:', error);
        return { success: false, error: 'Failed to fetch product stats' };
    }
}
