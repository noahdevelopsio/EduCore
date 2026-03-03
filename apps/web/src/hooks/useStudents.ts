import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    admissionNumber: string;
    dateOfBirth: string;
    gender: string;
    classId: string;
}

export function useStudents() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['students'],
        queryFn: () => apiFetch('/students').then(res => res.data as Student[]),
    });

    const createMutation = useMutation({
        mutationFn: (data: Partial<Student>) => apiFetch('/students', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    return { ...query, createMutation };
}
