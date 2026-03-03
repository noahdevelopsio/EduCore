'use client';

import { useAuthStore } from '@/stores/authStore';
import { BookOpen, ClipboardCheck, PenTool, Users } from 'lucide-react';

export default function TeacherDashboardPage() {
    const { user } = useAuthStore();

    // In a real app we would use a hook like useTeacherStats()
    const stats = [
        { label: 'My Classes', value: '2', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Students', value: '85', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Attendance Average', value: '92%', icon: ClipboardCheck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pending Grades', value: '14', icon: PenTool, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Teacher Dashboard</h1>
                <p className="text-neutral-500 font-body mt-1">Welcome back, {user?.email}!</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((card, i) => (
                    <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full ${card.bg} opacity-50 group-hover:scale-110 transition-transform`} />
                        <div className="relative z-10">
                            <div className={`${card.bg} ${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                <card.icon size={24} />
                            </div>
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-1">{card.label}</h3>
                            <p className="text-3xl font-display font-black text-neutral-900 leading-none">
                                {card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-8 min-h-[300px]">
                <h4 className="font-display font-bold text-lg mb-4">Today's Schedule & Quick Actions</h4>
                <div className="h-full flex items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-100 rounded-xl py-12">
                    Select a module on the sidebar, or view classes for today.
                </div>
            </div>
        </div>
    );
}
