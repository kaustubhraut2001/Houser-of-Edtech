'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function authenticate(formData: FormData): Promise<{ success: false; error: string } | void> {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email || !password) {
            return { success: false, error: 'Email and password are required' };
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify({ userId: user.id, email: user.email }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        redirect('/dashboard');
    } catch (error) {
        // If it's a redirect error, re-throw it
        if (error && typeof error === 'object' && 'digest' in error) {
            throw error;
        }
        console.error('Authentication error:', error);
        return { success: false, error: 'An error occurred during authentication' };
    }
}

export async function register(formData: FormData): Promise<{ success: false; error: string } | void> {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;
        const name = formData.get('name') as string;

        // Validation
        if (!email || !password || !confirmPassword) {
            return { success: false, error: 'All fields are required' };
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Invalid email format' };
        }

        // Password validation
        if (password.length < 8) {
            return { success: false, error: 'Password must be at least 8 characters long' };
        }

        if (password !== confirmPassword) {
            return { success: false, error: 'Passwords do not match' };
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: 'An account with this email already exists' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: 'USER',
            },
        });

        // Set session cookie (auto-login)
        const cookieStore = await cookies();
        cookieStore.set('session', JSON.stringify({ userId: user.id, email: user.email }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        redirect('/dashboard');
    } catch (error) {
        // If it's a redirect error, re-throw it
        if (error && typeof error === 'object' && 'digest' in error) {
            throw error;
        }
        console.error('Registration error:', error);
        return { success: false, error: 'An error occurred during registration' };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (!session) {
        return null;
    }

    try {
        return JSON.parse(session.value);
    } catch {
        return null;
    }
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session?.userId) return null;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session?.userId) return { success: false, error: 'Not authenticated' };

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!email) {
        return { success: false, error: 'Email is required' };
    }

    try {
        // Check if email is taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.id !== session.userId) {
            return { success: false, error: 'Email is already in use' };
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: { name, email },
        });

        // Update session if email changed
        if (email !== session.email) {
            const cookieStore = await cookies();
            cookieStore.set('session', JSON.stringify({ userId: updatedUser.id, email: updatedUser.email }), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7,
            });
        }

        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

export async function changePassword(formData: FormData) {
    const session = await getSession();
    if (!session?.userId) return { success: false, error: 'Not authenticated' };

    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { success: false, error: 'All fields are required' };
    }

    if (newPassword.length < 8) {
        return { success: false, error: 'New password must be at least 8 characters' };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, error: 'New passwords do not match' };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
        });

        if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
            return { success: false, error: 'Incorrect current password' };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.userId },
            data: { password: hashedPassword },
        });

        return { success: true, message: 'Password changed successfully' };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, error: 'Failed to change password' };
    }
}
