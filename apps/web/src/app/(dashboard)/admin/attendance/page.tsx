'use client';

import { useState, useMemo } from 'react';
import { useClasses } from '@/hooks/useClasses';
import { useStudents, Student } from '@/hooks/useStudents';
import { useAttendance, AttendanceRecord } from '@/hooks/useAttendance';
import { format } from 'date-fns';
import { Save, Calendar } from 'lucide-react';

export default function AttendancePage() {
    const { data: classes, isLoading: classesLoading } = useClasses();
    const { data: allStudents, isLoading: studentsLoading } = useStudents();

    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [localStatusChanges, setLocalStatusChanges] = useState<Record<string, AttendanceRecord['status']>>({});

    // Filter students based on selected class
    const classStudents = useMemo(() => {
        return selectedClass && allStudents ? allStudents.filter((s: Student) => s.classId === selectedClass) : [];
    }, [allStudents, selectedClass]);

    // Fetch Attendance records for class/date
    const { data: attendanceData, isLoading: attendanceLoading, markMutation } = useAttendance(selectedClass, selectedDate);

    const getStudentStatus = (studentId: string): 'PRESENT' | 'ABSENT' | 'LATE' => {
        // Return local change if edited, else original server data, else default
        if (localStatusChanges[studentId]) return localStatusChanges[studentId];
        const existing = attendanceData?.find(a => a.studentId === studentId);
        return existing?.status || 'PRESENT'; // default new entry
    };

    const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
        setLocalStatusChanges(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = () => {
        if (!selectedClass || !selectedDate || classStudents.length === 0) return;

        const records = classStudents.map((student: Student) => ({
            studentId: student.id,
            status: getStudentStatus(student.id)
        }));

        markMutation.mutate({
            classId: selectedClass,
            date: new Date(selectedDate).toISOString(),
            records
        }, {
            onSuccess: () => {
                setLocalStatusChanges({});
                alert('Attendance saved successfully!');
            },
            onError: (err) => {
                alert('Failed to save attendance: ' + err.message);
            }
        });
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900">Attendance</h1>
                    <p className="text-neutral-500 font-body text-sm mt-1">Record and manage daily class attendance.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!selectedClass || classStudents.length === 0 || markMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-body font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-neutral-300 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                    <Save size={18} />
                    {markMutation.isPending ? 'Saving...' : 'Save Register'}
                </button>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm shrink-0 flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Select Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => {
                            setSelectedClass(e.target.value);
                            setLocalStatusChanges({});
                        }}
                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                    >
                        <option value="">-- Choose a Class --</option>
                        {classes?.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Select Date</label>
                    <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setLocalStatusChanges({});
                            }}
                            max={new Date().toISOString().split('T')[0]}
                            className="w-full border border-neutral-200 rounded-md py-2 pl-10 pr-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-neutral-800"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
                <div className="overflow-y-auto flex-1 p-0 m-0 relative">
                    <table className="w-full text-left font-body text-sm">
                        <thead className="bg-neutral-50/90 backdrop-blur-md border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-xs tracking-wider sticky top-0 z-10 w-full">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Adm. No</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {(!selectedClass) ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                                        Please select a class to load the attendance register.
                                    </td>
                                </tr>
                            ) : attendanceLoading || studentsLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                                        Loading register...
                                    </td>
                                </tr>
                            ) : classStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                                        No students found in this class.
                                    </td>
                                </tr>
                            ) : (
                                classStudents.map((student: Student) => {
                                    const status = getStudentStatus(student.id);
                                    return (
                                        <tr key={student.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-900">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500">{student.admissionNumber}</td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    {/* Present */}
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${status === 'PRESENT'
                                                                ? 'bg-green-100 text-green-700 border-2 border-green-500 shadow-sm'
                                                                : 'bg-white text-neutral-500 border-2 border-neutral-200 hover:border-green-300 hover:text-green-600'
                                                            }`}
                                                    >
                                                        PRESENT
                                                    </button>
                                                    {/* Absent */}
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${status === 'ABSENT'
                                                                ? 'bg-red-100 text-red-700 border-2 border-red-500 shadow-sm'
                                                                : 'bg-white text-neutral-500 border-2 border-neutral-200 hover:border-red-300 hover:text-red-600'
                                                            }`}
                                                    >
                                                        ABSENT
                                                    </button>
                                                    {/* Late */}
                                                    <button
                                                        onClick={() => handleStatusChange(student.id, 'LATE')}
                                                        className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${status === 'LATE'
                                                                ? 'bg-amber-100 text-amber-700 border-2 border-amber-500 shadow-sm'
                                                                : 'bg-white text-neutral-500 border-2 border-neutral-200 hover:border-amber-300 hover:text-amber-600'
                                                            }`}
                                                    >
                                                        LATE
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
