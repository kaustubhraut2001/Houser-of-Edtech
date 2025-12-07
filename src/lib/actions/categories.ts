'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper function to create slug from name
const slugify = (text: string) =>
    text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w-]+/g, '')       // Remove all non-word chars
        .replace(/--+/g, '-')           // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text

export interface CategoryFormData {
    name: string;
}

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: 'Failed to fetch categories' };
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
        return { success: true, data: category };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, error: 'Failed to fetch category' };
    }
}

export async function createCategory(data: CategoryFormData) {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: slugify(data.name),
            },
        });
        revalidatePath('/dashboard/products');
        return { success: true, data: category };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Failed to create category' };
    }
}

export async function updateCategory(id: string, data: CategoryFormData) {
    try {
        // Get current category to check if name changed
        const currentCategory = await prisma.category.findUnique({
            where: { id },
        });

        const updateData: any = {
            name: data.name,
        };

        // Only update slug if name has changed
        if (currentCategory && currentCategory.name !== data.name) {
            updateData.slug = slugify(data.name);
        }

        const category = await prisma.category.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/dashboard/products');
        return { success: true, data: category };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Failed to update category' };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath('/dashboard/products');
        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Failed to delete category. Remove associated products first.' };
    }
}
