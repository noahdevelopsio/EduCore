'use client';

import { useState, useMemo } from 'react';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudents, Student } from '@/hooks/useStudents';
import { useGrades, GradeRecord } from '@/hooks/useGrades';
import { Save } from 'lucide-react';

export default function GradesPage() {
    const { data: subjects, isLoading: subjectsLoading } = useSubjects();
    const { data: allStudents, isLoading: studentsLoading } = useStudents();

    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [term, setTerm] = useState<number>(1);
    const [year, setYear] = useState<number>(new Date().getFullYear());

    // Local changes hold either CA or Exam scores being typed
    const [localScores, setLocalScores] = useState<Record<string, { caScore: string, examScore: string }>>({});

    const subjectData = useMemo(() => subjects?.find(s => s.id === selectedSubject), [subjects, selectedSubject]);

    const classStudents = useMemo(() => {
        return subjectData && allStudents ? allStudents.filter((s: Student) => s.classId === subjectData.classId) : [];
    }, [allStudents, subjectData]);

    const { data: gradesData, isLoading: gradesLoading, saveMutation } = useGrades(selectedSubject, term, year);

    const getStudentScores = (studentId: string) => {
        if (localScores[studentId]) return localScores[studentId];
        const existing = gradesData?.find(g => g.studentId === studentId);
        return {
            caScore: existing?.caScore !== null && existing?.caScore !== undefined ? existing.caScore.toString() : '',
            examScore: existing?.examScore !== null && existing?.examScore !== undefined ? existing.examScore.toString() : ''
        };
    };

    const handleScoreChange = (studentId: string, type: 'caScore' | 'examScore', value: string) => {
        setLocalScores(prev => ({
            ...prev,
            [studentId]: {
                ...getStudentScores(studentId),
                [type]: value
            }
        }));
    };

    const handleSave = () => {
        if (!selectedSubject || classStudents.length === 0) return;

        const records = classStudents.map((student: Student) => {
            const scores = getStudentScores(student.id);
            return {
                studentId: student.id,
                caScore: scores.caScore ? Number(scores.caScore) : undefined,
                examScore: scores.examScore ? Number(scores.examScore) : undefined
            };
        });

        saveMutation.mutate({
            subjectId: selectedSubject,
            term,
            year,
            records
        }, {
            onSuccess: () => {
                setLocalScores({});
                alert('Grades saved successfully!');
            },
            onError: (err) => {
                alert('Failed to save grades: ' + err.message);
            }
        });
    };

    return (
        <div className="space-y-8 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-display font-bold text-neutral-900">Grades Entry</h1>
                    <p className="text-neutral-500 font-body text-sm mt-1">Record scores for Continuous Assessment (C.A) and Exams.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!selectedSubject || classStudents.length === 0 || saveMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-body font-semibold px-5 py-2.5 rounded-md transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-neutral-300 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                    <Save size={18} />
                    {saveMutation.isPending ? 'Saving...' : 'Save Grades'}
                </button>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-sm shrink-0 flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Select Subject</label>
                    <select
                        value={selectedSubject}
                        onChange={(e) => {
                            setSelectedSubject(e.target.value);
                            setLocalScores({});
                        }}
                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                    >
                        <option value="">-- Choose a Subject --</option>
                        {subjects?.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.class?.name || 'Unknown Class'})</option>
                        ))}
                    </select>
                </div>
                <div className="w-24">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Term</label>
                    <select
                        value={term}
                        onChange={(e) => setTerm(Number(e.target.value))}
                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                    >
                        <option value={1}>1st</option>
                        <option value={2}>2nd</option>
                        <option value={3}>3rd</option>
                    </select>
                </div>
                <div className="w-32">
                    <label className="block text-sm font-semibold text-neutral-700 mb-1">Year</label>
                    <input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full border border-neutral-200 rounded-md py-2 px-3 text-sm font-body outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
                <div className="overflow-y-auto flex-1 p-0 m-0 relative">
                    <table className="w-full text-left font-body text-sm">
                        <thead className="bg-neutral-50/90 backdrop-blur-md border-b border-neutral-200 text-neutral-600 font-semibold uppercase text-xs tracking-wider sticky top-0 z-10 w-full">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Adm. No</th>
                                <th className="px-6 py-4 w-32">C.A (40)</th>
                                <th className="px-6 py-4 w-32">Exam (60)</th>
                                <th className="px-6 py-4 w-24">Total</th>
                                <th className="px-6 py-4 w-24">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {(!selectedSubject) ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        Please select a subject to load the grades sheet.
                                    </td>
                                </tr>
                            ) : gradesLoading || studentsLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        Loading sheet...
                                    </td>
                                </tr>
                            ) : classStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        No students found for this subject's class.
                                    </td>
                                </tr>
                            ) : (
                                classStudents.map((student: Student) => {
                                    const scores = getStudentScores(student.id);
                                    const ca = Number(scores.caScore) || 0;
                                    const ex = Number(scores.examScore) || 0;
                                    const total = (scores.caScore || scores.examScore) ? ca + ex : null;

                                    let gradeLetter = '-';
                                    if (total !== null) {
                                        if (total >= 70) gradeLetter = 'A';
                                        else if (total >= 60) gradeLetter = 'B';
                                        else if (total >= 50) gradeLetter = 'C';
                                        else if (total >= 40) gradeLetter = 'D';
                                        else gradeLetter = 'F';
                                    }

                                    return (
                                        <tr key={student.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-3 font-medium text-neutral-900 align-middle">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="px-6 py-3 text-neutral-500 align-middle">{student.admissionNumber}</td>
                                            <td className="px-6 py-2">
                                                <input
                                                    type="number"
                                                    min="0" max="40"
                                                    value={scores.caScore}
                                                    onChange={(e) => handleScoreChange(student.id, 'caScore', e.target.value)}
                                                    className="w-20 border border-neutral-200 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-6 py-2">
                                                <input
                                                    type="number"
                                                    min="0" max="60"
                                                    value={scores.examScore}
                                                    onChange={(e) => handleScoreChange(student.id, 'examScore', e.target.value)}
                                                    className="w-20 border border-neutral-200 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="px-6 py-3 font-semibold text-neutral-800 align-middle">
                                                {total !== null ? total : '-'}
                                            </td>
                                            <td className="px-6 py-3 align-middle">
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${gradeLetter === 'A' ? 'bg-green-100 text-green-700' :
                                                        gradeLetter === 'B' ? 'bg-blue-100 text-blue-700' :
                                                            gradeLetter === 'C' ? 'bg-indigo-100 text-indigo-700' :
                                                                gradeLetter === 'D' ? 'bg-amber-100 text-amber-700' :
                                                                    gradeLetter === 'F' ? 'bg-red-100 text-red-700' :
                                                                        'bg-neutral-100 text-neutral-500'
                                                    }`}>
                                                    {gradeLetter}
                                                </span>
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
