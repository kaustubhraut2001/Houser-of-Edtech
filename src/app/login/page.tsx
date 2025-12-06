import { authenticate } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageIcon } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <Card className="w-full max-w-md border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                            <PackageIcon className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Inventory Manager</CardTitle>
                    <CardDescription className="text-slate-400">
                        Sign in to access your inventory dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={authenticate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                required
                                className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 font-semibold hover:from-purple-700 hover:to-pink-700"
                        >
                            Sign In
                        </Button>
                        <p className="text-center text-sm text-slate-400">
                            Demo: admin@example.com / password123
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
