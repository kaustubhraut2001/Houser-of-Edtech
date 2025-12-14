import { getCurrentUser } from '@/lib/actions/auth';
import SettingsClient from '@/components/settings/SettingsClient';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    return <SettingsClient user={user} />;
}
