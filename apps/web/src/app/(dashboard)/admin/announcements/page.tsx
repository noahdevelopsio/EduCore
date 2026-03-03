'use client';

import { useState } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Plus, Megaphone, Send, Clock, UserSquare2, Users, GraduationCap } from 'lucide-react';

export default function AnnouncementsPage() {
    const { data: announcements, isLoading, createMutation } = useAnnouncements();
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState({ title: '', body: '', targetRoles: [] as string[] });

    const roleLabels: Record<string, { label: string, icon: any }> = {
        TEACHER: { label: 'Teachers', icon: UserSquare2 },
        PARENT: { label: 'Parents', icon: Users },
        STUDENT: { label: 'Students', icon: GraduationCap },
    };

    const roleOptions = Object.keys(roleLabels);

    const toggleRole = (role: string) => {
        setForm(prev => ({
            ...prev,
            targetRoles: prev.targetRoles.includes(role)
                ? prev.targetRoles.filter(r => r !== role)
                : [...prev.targetRoles, role]
        }));
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.targetRoles.length === 0) {
            alert('Please select at least one recipient group.');
            return;
        }

        createMutation.mutate(form, {
            onSuccess: () => {
                setForm({ title: '', body: '', targetRoles: [] });
                setIsCreating(false);
                alert('Announcement sent and email jobs dispatched!');
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900 tracking-tight">Announcements</h1>
                    <p className="text-neutral-500 font-body mt-1">Broadcast school events, emergencies, and updates.</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold font-body py-2.5 px-5 rounded-lg transition-all shadow-sm"
                    >
                        <Plus size={18} />
                        New Announcement
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b border-neutral-100 pb-4">
                        <h2 className="text-xl font-display font-semibold flex items-center gap-2">
                            <Megaphone size={20} className="text-primary-500" />
                            Compose Announcement
                        </h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-neutral-400 hover:text-neutral-600 font-medium text-sm"
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Announcement Title</label>
                            <input
                                required
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. End of Term Holidays"
                                className="w-full border border-neutral-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm bg-neutral-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-3">Send to Recipients</label>
                            <div className="flex flex-wrap gap-4">
                                {roleOptions.map(role => {
                                    const RoleIcon = roleLabels[role].icon;
                                    const isActive = form.targetRoles.includes(role);
                                    return (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => toggleRole(role)}
                                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border font-medium text-sm transition-all ${isActive
                                                    ? 'bg-primary-50 border-primary-500 text-primary-700 ring-4 ring-primary-500/10'
                                                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                                }`}
                                        >
                                            <RoleIcon size={18} className={isActive ? 'text-primary-600' : 'text-neutral-400'} />
                                            {roleLabels[role].label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Message Body</label>
                            <textarea
                                required
                                rows={5}
                                value={form.body}
                                onChange={e => setForm({ ...form, body: e.target.value })}
                                placeholder="Write your message here..."
                                className="w-full border border-neutral-200 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm bg-neutral-50 focus:bg-white resize-none"
                            />
                            <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                                <Clock size={12} /> Emails will be queued and sent immediately via background job workers.
                            </p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                disabled={createMutation.isPending}
                                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white font-semibold font-body py-3 px-8 rounded-xl transition-all shadow-md disabled:opacity-70"
                            >
                                <Send size={18} />
                                {createMutation.isPending ? 'Queuing Jobs...' : 'Send Broadcast'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                <h3 className="font-display font-semibold text-lg text-neutral-800">Past Broadcasts</h3>
                {isLoading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white border border-neutral-100 rounded-2xl w-full" />)}
                    </div>
                ) : announcements?.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-neutral-200 border-dashed rounded-2xl">
                        <Megaphone className="mx-auto text-neutral-300 mb-3" size={40} />
                        <p className="text-neutral-500 font-medium">No announcements yet.</p>
                    </div>
                ) : (
                    announcements?.map(ann => (
                        <div key={ann.id} className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                            <div className="flex-1">
                                <h4 className="text-lg font-display font-bold text-neutral-900">{ann.title}</h4>
                                <p className="text-neutral-600 text-sm mt-2 whitespace-pre-wrap leading-relaxed">{ann.body}</p>
                            </div>
                            <div className="sm:border-l border-neutral-100 sm:pl-6 min-w-[200px] flex flex-col justify-between items-start">
                                <div>
                                    <h5 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Sent To</h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {ann.targetRoles.map(r => (
                                            <span key={r} className="bg-primary-50 text-primary-700 border border-primary-100 px-2 py-1 rounded text-xs font-bold">
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-0 text-xs text-neutral-400 font-medium whitespace-nowrap">
                                    {new Date(ann.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
