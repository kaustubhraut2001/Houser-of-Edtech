import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Settings</h1>

            <Card className="border-slate-700 bg-slate-900/50 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="text-white">Application Settings</CardTitle>
                    <CardDescription className="text-slate-400">
                        Manage your inventory application preferences
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-slate-300">
                    <p>Settings page coming soon...</p>
                </CardContent>
            </Card>
        </div>
    );
}
