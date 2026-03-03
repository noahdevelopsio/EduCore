import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface SubjectData {
    id: string;
    name: string;
    classId: string;
    teacherId: string;
    class?: { name: string };
}

export function useSubjects() {
    const queryClient = useQueryClient();
    const queryKey = ['subjects'];

    const query = useQuery({
        queryKey,
        queryFn: () => apiFetch('/subjects').then(res => res.data as SubjectData[]),
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<SubjectData, 'id' | 'class'>) =>
            apiFetch('/subjects', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return { ...query, createMutation };
}
