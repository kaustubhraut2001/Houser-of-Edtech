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
