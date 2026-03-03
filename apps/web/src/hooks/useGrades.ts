import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface GradeRecord {
    studentId: string;
    caScore?: number;
    examScore?: number;
}

export interface GradeData {
    id: string;
    studentId: string;
    subjectId: string;
    term: number;
    year: number;
    caScore: number | null;
    examScore: number | null;
    total: number | null;
    grade: string | null;
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        admissionNumber: string;
    };
}

export function useGrades(subjectId: string, term: number, year: number) {
    const queryClient = useQueryClient();
    const queryKey = ['grades', subjectId, term, year];

    const query = useQuery({
        queryKey,
        queryFn: () => apiFetch(`/grades/subject/${subjectId}?term=${term}&year=${year}`).then(res => res.data as GradeData[]),
        enabled: !!subjectId && !!term && !!year,
    });

    const saveMutation = useMutation({
        mutationFn: (data: { subjectId: string; term: number; year: number; records: GradeRecord[] }) =>
            apiFetch('/grades', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return { ...query, saveMutation };
}
