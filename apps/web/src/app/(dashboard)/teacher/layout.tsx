'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { LayoutDashboard, LogOut, BookOpen, ClipboardCheck, PenTool, Megaphone, Folder } from 'lucide-react';

const MENUS = [
    { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
    { name: 'My Classes', href: '/teacher/classes', icon: BookOpen },
    { name: 'Attendance', href: '/teacher/attendance', icon: ClipboardCheck },
    { name: 'Grades', href: '/teacher/grades', icon: PenTool },
    { name: 'Resources', href: '/teacher/resources', icon: Folder },
    { name: 'Announcements', href: '/teacher/announcements', icon: Megaphone },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, clearAuth } = useAuthStore();

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col hidden md:flex fixed h-full z-10">
                <div className="h-16 flex items-center px-6 border-b border-neutral-200">
                    <span className="font-display font-bold text-xl text-primary-600">EduCore Teacher</span>
                </div>

                <div className="p-4 border-b border-neutral-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                        {user?.email?.charAt(0).toUpperCase() || 'T'}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-neutral-900 line-clamp-1">{user?.email}</p>
                        <p className="text-xs text-neutral-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {MENUS.map((menu) => {
                        const isActive = pathname === menu.href || pathname.startsWith(`${menu.href}/`);
                        // Exact match for Dashboard
                        if (menu.href === '/teacher' && pathname !== '/teacher') return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            >
                                <menu.icon size={20} className="text-neutral-400" />
                                {menu.name}
                            </Link>
                        );

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                    }`}
                            >
                                <menu.icon size={20} className={isActive ? 'text-primary-600' : 'text-neutral-400'} />
                                {menu.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-200">
                    <button
                        onClick={clearAuth}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-all"
                    >
                        <LogOut size={20} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <div className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
