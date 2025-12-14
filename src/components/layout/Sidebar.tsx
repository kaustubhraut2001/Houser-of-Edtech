'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Settings, LogOut, Tags } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/actions/auth';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: Tags },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex w-64 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-lg">
            <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                    <Package className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Inventory</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-slate-800/50',
                                isActive
                                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400'
                                    : 'text-slate-400 hover:text-white'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-slate-800 p-4">
                <form action={logout}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-all hover:bg-red-900/20 hover:text-red-400"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
