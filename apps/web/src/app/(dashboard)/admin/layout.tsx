'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Users, LayoutDashboard, Settings, LogOut, BookOpen, UserSquare2, ClipboardCheck, PenTool, CreditCard } from 'lucide-react';

const MENUS = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Classes', href: '/admin/classes', icon: BookOpen },
    { name: 'Attendance', href: '/admin/attendance', icon: ClipboardCheck },
    { name: 'Grades', href: '/admin/grades', icon: PenTool },
    { name: 'Fees', href: '/admin/fees', icon: CreditCard },
    { name: 'Staff', href: '/admin/staff', icon: UserSquare2 },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const logout = useAuthStore((state: any) => state.clearAuth);

    return (
        <div className="flex bg-neutral-50 h-screen font-body text-neutral-800">
            {/* Sidebar */}
            <nav className="hidden md:flex flex-col w-64 bg-neutral-900 border-r border-neutral-200 py-6">
                <div className="px-6 mb-8 mt-2">
                    <h1 className="text-white font-display text-2xl font-bold tracking-tight">EduCore</h1>
                    <p className="text-neutral-400 text-xs mt-1 uppercase tracking-widest font-semibold">Admin Panel</p>
                </div>

                <div className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
                    {MENUS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(`${item.href}/`));
                        return (
                            <Link key={item.name} href={item.href}>
                                <span className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'text-white bg-primary-500/15 border border-primary-500/30'
                                    : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                                    }`}>
                                    <item.icon size={20} className={isActive ? 'text-primary-500' : ''} />
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                <div className="px-3 mt-auto">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar logic (mobile toggle etc could go here) */}
                <header className="bg-white shadow-sm border-b border-neutral-200 h-16 flex items-center px-8 shrink-0 md:hidden">
                    <h1 className="font-display font-semibold text-lg">EduCore</h1>
                </header>

                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-[1200px] mx-auto h-full">
                        {children}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Tab Bar (simplified representation) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around p-3 z-50">
                {MENUS.slice(0, 4).map(item => (
                    <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 text-neutral-500">
                        <item.icon size={20} />
                        <span className="text-[10px] font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
