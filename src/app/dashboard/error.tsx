'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Dashboard error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <Card className="w-full max-w-md border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-red-500/10 p-3">
                            <AlertTriangle className="h-8 w-8 text-red-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Something went wrong!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-slate-400">
                        {error.message || 'An unexpected error occurred'}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={reset}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                            Try again
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/login'}
                            variant="outline"
                            className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Go to Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

