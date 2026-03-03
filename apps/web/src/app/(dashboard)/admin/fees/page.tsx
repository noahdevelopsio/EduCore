'use client';

import { useState } from 'react';
import { useFees, FeeStructure } from '@/hooks/useFees';
import { useClasses } from '@/hooks/useClasses';
import { useStudents } from '@/hooks/useStudents';
import { Plus, CreditCard, History, Settings2, ReceiptText } from 'lucide-react';

export default function FeesPage() {
    const [activeTab, setActiveTab] = useState<'structures' | 'payments' | 'new-structure' | 'new-payment'>('structures');
    const { structures, isLoadingStructures, createStructure, isCreatingStructure, recordPayment, isRecordingPayment } = useFees();
    const { data: classes } = useClasses();
    const { data: students } = useStudents();

    // Form states
    const [strForm, setStrForm] = useState({ name: '', amount: '', term: 1, academicYear: '2023/2024', classId: '' });
    const [payForm, setPayForm] = useState({ studentId: '', feeStructureId: '', amountPaid: '', method: 'BANK_TRANSFER', reference: '' });

    const handleCreateStructure = (e: React.FormEvent) => {
        e.preventDefault();
        createStructure({
            ...strForm,
            amount: Number(strForm.amount),
            term: Number(strForm.term),
            classId: strForm.classId || undefined
        }, {
            onSuccess: () => {
                alert('Fee structure created!');
                setActiveTab('structures');
                setStrForm({ name: '', amount: '', term: 1, academicYear: '2023/2024', classId: '' });
            }
        });
    };

    const handleRecordPayment = (e: React.FormEvent) => {
        e.preventDefault();
        recordPayment({
            ...payForm,
            amountPaid: Number(payForm.amountPaid)
        }, {
            onSuccess: () => {
                alert('Payment recorded!');
                setActiveTab('structures'); // Or a payments list if we had one
                setPayForm({ studentId: '', feeStructureId: '', amountPaid: '', method: 'BANK_TRANSFER', reference: '' });
            }
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-neutral-900">Fee Management</h1>
                <p className="text-neutral-500 font-body text-sm mt-1">Manage school fees, structures, and student payments.</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 gap-8">
                {[
                    { id: 'structures', label: 'Structures', icon: Settings2 },
                    { id: 'payments', label: 'Payments History', icon: History },
                    { id: 'new-structure', label: 'Add Structure', icon: Plus },
                    { id: 'new-payment', label: 'Record Payment', icon: CreditCard },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-body font-medium text-sm transition-all ${activeTab === tab.id
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                            }`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === 'structures' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoadingStructures ? (
                            <p>Loading...</p>
                        ) : structures?.map((str) => (
                            <div key={str.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-primary-50 p-2 rounded-lg">
                                        <ReceiptText className="text-primary-600" size={24} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-50 px-2 py-1 rounded">
                                        Term {str.term}
                                    </span>
                                </div>
                                <h3 className="font-display font-bold text-lg text-neutral-900">{str.name}</h3>
                                <p className="text-neutral-500 text-sm mb-4">
                                    {str.class?.name || 'All Classes'} • {str.academicYear}
                                </p>
                                <div className="text-2xl font-display font-black text-primary-600">
                                    ₦{str.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'new-structure' && (
                    <div className="max-w-xl bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
                        <form onSubmit={handleCreateStructure} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Fee Name</label>
                                <input
                                    required
                                    value={strForm.name}
                                    onChange={e => setStrForm({ ...strForm, name: e.target.value })}
                                    placeholder="e.g. Tuition Fee"
                                    className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Amount (₦)</label>
                                    <input
                                        required type="number"
                                        value={strForm.amount}
                                        onChange={e => setStrForm({ ...strForm, amount: e.target.value })}
                                        placeholder="50000"
                                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Term</label>
                                    <select
                                        value={strForm.term}
                                        onChange={e => setStrForm({ ...strForm, term: Number(e.target.value) })}
                                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    >
                                        <option value={1}>1st Term</option>
                                        <option value={2}>2nd Term</option>
                                        <option value={3}>3rd Term</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Academic Year</label>
                                    <input
                                        required
                                        value={strForm.academicYear}
                                        onChange={e => setStrForm({ ...strForm, academicYear: e.target.value })}
                                        placeholder="2023/2024"
                                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Class (Optional)</label>
                                    <select
                                        value={strForm.classId}
                                        onChange={e => setStrForm({ ...strForm, classId: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    >
                                        <option value="">All Classes</option>
                                        {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button
                                disabled={isCreatingStructure}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-md transition-colors"
                            >
                                Create Structure
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'new-payment' && (
                    <div className="max-w-xl bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
                        <form onSubmit={handleRecordPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Select Student</label>
                                <select
                                    required
                                    value={payForm.studentId}
                                    onChange={e => setPayForm({ ...payForm, studentId: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                >
                                    <option value="">-- Choose Student --</option>
                                    {students?.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Fee Structure</label>
                                <select
                                    required
                                    value={payForm.feeStructureId}
                                    onChange={e => setPayForm({ ...payForm, feeStructureId: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                >
                                    <option value="">-- Choose Fee --</option>
                                    {structures?.map(str => <option key={str.id} value={str.id}>{str.name} (₦{str.amount})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Amount Paid (₦)</label>
                                    <input
                                        required type="number"
                                        value={payForm.amountPaid}
                                        onChange={e => setPayForm({ ...payForm, amountPaid: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Payment Method</label>
                                    <select
                                        value={payForm.method}
                                        onChange={e => setPayForm({ ...payForm, method: e.target.value })}
                                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    >
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="CASH">Cash</option>
                                        <option value="ONLINE">Online (Card)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Reference / Receipt Number</label>
                                <input
                                    required
                                    value={payForm.reference}
                                    onChange={e => setPayForm({ ...payForm, reference: e.target.value })}
                                    className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                />
                            </div>
                            <button
                                disabled={isRecordingPayment}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2.5 rounded-md transition-colors"
                            >
                                Record Payment
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'payments' && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-neutral-300">
                        <History size={48} className="mx-auto text-neutral-300 mb-4" />
                        <p className="text-neutral-500 font-body">Detailed payment history coming soon in next sub-patch.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
