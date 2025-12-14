'use client';

import { useState, useTransition } from 'react';
import { updateProfile, changePassword } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, Shield, Save, Key, UserCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function SettingsClient({ user }: { user: any }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    if (!user) return null;

    async function handleProfileUpdate(formData: FormData) {
        startTransition(async () => {
            setMessage(null);
            const result = await updateProfile(formData);

            if (result.success) {
                setMessage({ type: 'success', text: result.message || 'Profile updated' });
                router.refresh();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
            }
        });
    }

    async function handlePasswordChange(formData: FormData) {
        startTransition(async () => {
            setMessage(null);
            const result = await changePassword(formData);

            if (result.success) {
                setMessage({ type: 'success', text: result.message || 'Password changed' });
                // Reset form
                const form = document.getElementById('password-form') as HTMLFormElement;
                if (form) form.reset();
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to change password' });
            }
        });
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            {/* Custom Tabs */}
            <div className="flex space-x-1 rounded-lg bg-slate-900/50 p-1 backdrop-blur-lg border border-slate-800 w-fit">
                <button
                    onClick={() => { setActiveTab('profile'); setMessage(null); }}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${activeTab === 'profile'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <UserCircle className="h-4 w-4" />
                    Profile
                </button>
                <button
                    onClick={() => { setActiveTab('security'); setMessage(null); }}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${activeTab === 'security'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Lock className="h-4 w-4" />
                    Security
                </button>
                <button
                    onClick={() => { setActiveTab('account'); setMessage(null); }}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${activeTab === 'account'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Shield className="h-4 w-4" />
                    Account
                </button>
            </div>

            {/* Feedback Message */}
            {message && (
                <div className={`rounded-lg border p-4 ${message.type === 'success'
                        ? 'border-green-500/50 bg-green-500/10 text-green-400'
                        : 'border-red-500/50 bg-red-500/10 text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="text-white">Profile Information</CardTitle>
                        <CardDescription className="text-slate-400">Update your account profile details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300">Display Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={user.name || ''}
                                    className="border-slate-700 bg-slate-800/50 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue={user.email}
                                    required
                                    className="border-slate-700 bg-slate-800/50 text-white"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="text-white">Security Settings</CardTitle>
                        <CardDescription className="text-slate-400">Manage your password and security preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="password-form" action={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    required
                                    className="border-slate-700 bg-slate-800/50 text-white"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        className="border-slate-700 bg-slate-800/50 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="border-slate-700 bg-slate-800/50 text-white"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                                <Key className="mr-2 h-4 w-4" />
                                {isPending ? 'Updating...' : 'Change Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
                <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                    <CardHeader>
                        <CardTitle className="text-white">Account Information</CardTitle>
                        <CardDescription className="text-slate-400">View your account status and role</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                                <p className="text-sm font-medium text-slate-400">User Role</p>
                                <p className="mt-1 text-lg font-semibold text-white">{user.role}</p>
                            </div>
                            <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                                <p className="text-sm font-medium text-slate-400">Account ID</p>
                                <p className="mt-1 text-sm font-mono text-white truncate" title={user.id}>{user.id}</p>
                            </div>
                            <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                                <p className="text-sm font-medium text-slate-400">Member Since</p>
                                <p className="mt-1 text-lg font-semibold text-white">{formatDate(user.createdAt)}</p>
                            </div>
                            <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                                <p className="text-sm font-medium text-slate-400">Last Updated</p>
                                <p className="mt-1 text-lg font-semibold text-white">{formatDate(user.updatedAt)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
