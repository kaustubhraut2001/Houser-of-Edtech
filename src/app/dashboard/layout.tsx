import { getSession } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let session;
    try {
        session = await getSession();
    } catch (error) {
        console.error('Error getting session:', error);
        redirect('/login');
    }

    if (!session) {
        redirect('/login');
    }

    const user = { email: session.email, name: session.email.split('@')[0] };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/20 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
