'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/components/comp_dashboard/Dashboard';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Si no hay token, lo mandamos al login inmediatamente
            router.push('/login');
        }
    }, [router]);

    return (
        <main className="container mx-auto">
            <Dashboard />
        </main>
    );
}