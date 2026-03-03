'use client';

import { useAuthStore } from '@/stores/authStore';
import { Calendar, PenTool, Folder, Megaphone } from 'lucide-react';

export default function StudentDashboardPage() {
    const { user } = useAuthStore();

    const stats = [
        { label: 'Upcoming Exams', value: '2', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Latest Grade', value: 'A', icon: PenTool, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'New Resources', value: '3', icon: Folder, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Announcements', value: '1', icon: Megaphone, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Student Dashboard</h1>
                <p className="text-neutral-500 font-body mt-1">Welcome, {user?.email}! Here is your current academic overview.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                    <h4 className="font-display font-bold text-lg mb-4">Today's Timetable</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border border-blue-100 bg-blue-50 rounded-xl">
                            <div>
                                <h5 className="font-semibold text-blue-900 text-sm">Mathematics</h5>
                                <p className="text-xs text-blue-700 mt-1">Mr. Kwame • 08:00 AM</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 border border-green-100 bg-green-50 rounded-xl">
                            <div>
                                <h5 className="font-semibold text-green-900 text-sm">Biology</h5>
                                <p className="text-xs text-green-700 mt-1">Mrs. Adeleke • 09:30 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
