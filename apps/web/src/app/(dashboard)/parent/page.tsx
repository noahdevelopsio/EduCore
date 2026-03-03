'use client';

import { useAuthStore } from '@/stores/authStore';
import { ClipboardCheck, PenTool, CreditCard, Bell } from 'lucide-react';

export default function ParentDashboardPage() {
    const { user } = useAuthStore();

    // In a real app we fetch these using a hook
    const stats = [
        { label: 'Children Enrolled', value: '2', icon: Bell, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Attendance Total', value: '96%', icon: ClipboardCheck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Outstanding Fees', value: '₦0', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'New Grades', value: '5', icon: PenTool, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Parent Dashboard</h1>
                <p className="text-neutral-500 font-body mt-1">Hello, {user?.email}! Here's an overview of your children's progress.</p>
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
                    <h4 className="font-display font-bold text-lg mb-4">Latest Announcements</h4>
                    <div className="space-y-4">
                        <div className="p-4 border border-neutral-100 rounded-xl bg-neutral-50">
                            <h5 className="font-semibold text-neutral-900 text-sm">PTA Meeting Scheduled</h5>
                            <p className="text-xs text-neutral-500 mt-1">A reminder that there will be a PTA meeting next Friday at 4PM...</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl p-8">
                    <h4 className="font-display font-bold text-lg mb-4">Upcoming Due Dates</h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center p-4 border border-red-100 bg-red-50 rounded-xl">
                            <div>
                                <h5 className="font-semibold text-red-900 text-sm">3rd Term Tuition</h5>
                                <p className="text-xs text-red-700 mt-1">Due in 5 days</p>
                            </div>
                            <span className="font-bold text-red-700">₦45,000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
