'use client';

import { useState } from 'react';
import { useStudents, Student } from '@/hooks/useStudents';
import { useClasses, ClassData } from '@/hooks/useClasses';
import { Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function StudentsPage() {
    const { data: students, isLoading } = useStudents();
    const { data: classes } = useClasses();
    const [search, setSearch] = useState('');

    const filteredStudents = students?.filter((s: Student) =>
        s.firstName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastName.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNumber.includes(search)
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900">Students</h1>
                    <p className="text-neutral-500 font-body text-sm mt-1">Manage and view all enrolled student records.</p>
                </div>
                <button
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-body font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                    <Plus size={18} />
                    Add Student
                </button>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search by name or admission number..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-body text-sm transition-all"
                        />
                    </div>
                    <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-md text-sm font-medium hover:bg-neutral-50 transition-colors">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-body text-sm">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Adm. No</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Gender</th>
                                <th className="px-6 py-4">DOB</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-neutral-500">Loading student records...</td>
                                </tr>
                            ) : filteredStudents?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        <div className="flex flex-col items-center">
                                            <Users size={32} className="text-neutral-300 mb-3" />
                                            <p className="font-medium text-neutral-700">No students found</p>
                                            <p className="text-sm">Try adjusting your search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents?.map((student: Student) => (
                                    <tr key={student.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-neutral-900 border-l-2 border-transparent hover:border-primary-500 transition-colors">
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">{student.admissionNumber}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700 border border-secondary-200">
                                                {classes?.find((c: ClassData) => c.id === student.classId)?.name || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500 capitalize">{student.gender.toLowerCase()}</td>
                                        <td className="px-6 py-4 text-neutral-500">{format(new Date(student.dateOfBirth), 'MMM d, yyyy')}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors mr-3">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Temporary icon to satisfy missing import inline
function Users(props: any) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
}
