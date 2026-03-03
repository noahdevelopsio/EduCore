import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface ClassData {
    id: string;
    name: string;
    section: string | null;
    academicYear: string;
}

export function useClasses() {
    return useQuery({
        queryKey: ['classes'],
        queryFn: () => apiFetch('/classes').then(res => res.data as ClassData[]),
    });
}
