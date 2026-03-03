'use client';

import { useFees } from '@/hooks/useFees';
import { Users, GraduationCap, DollarSign, CalendarCheck } from 'lucide-react';

export default function AdminDashboardPage() {
    const { stats, isLoadingStats } = useFees();

    const cards = [
        { label: 'Total Students', value: stats?.totalStudents ?? '-', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Attendance Today', value: stats?.attendanceToday ?? '-', icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Classes', value: '-', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Fees Collected', value: stats ? `₦${stats.totalFeesCollected.toLocaleString()}` : '-', icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Admin Dashboard</h1>
                <p className="text-neutral-500 font-body mt-1">Real-time overview of your school's performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 rounded-full ${card.bg} opacity-50 group-hover:scale-110 transition-transform`} />
                        <div className="relative z-10">
                            <div className={`${card.bg} ${card.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                <card.icon size={24} />
                            </div>
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-1">{card.label}</h3>
                            <p className="text-3xl font-display font-black text-neutral-900 leading-none">
                                {isLoadingStats ? '...' : card.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for charts or recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-8 min-h-[300px]">
                    <h4 className="font-display font-bold text-lg mb-4">Enrollment Overview</h4>
                    <div className="h-full flex items-center justify-center text-neutral-400 border-2 border-dashed border-neutral-100 rounded-xl">
                        Chart visualization coming in Phase 7
                    </div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                    <h4 className="font-display font-bold text-lg mb-4">Recent Activity</h4>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4 items-center">
                                <div className="w-2 h-2 rounded-full bg-primary-500" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-800">New student enrolled</p>
                                    <p className="text-xs text-neutral-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
