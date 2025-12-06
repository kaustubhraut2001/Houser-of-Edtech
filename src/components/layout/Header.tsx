'use client';

import { User } from 'next-auth';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
    user: User;
}

export default function Header({ user }: HeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur-lg">
            <div className="flex flex-1 items-center gap-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="w-full border-slate-700 bg-slate-800/50 pl-10 text-white placeholder:text-slate-500"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-slate-400 hover:text-white"
                >
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 p-0 text-xs">
                        3
                    </Badge>
                </Button>
                <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-semibold text-white">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="text-sm">
                        <p className="font-medium text-white">{user.name || 'User'}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
