import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface Announcement {
    id: string;
    title: string;
    body: string;
    targetRoles: string[];
    createdById: string;
    createdAt: string;
}

export function useAnnouncements() {
    const queryClient = useQueryClient();
    const queryKey = ['announcements'];

    const query = useQuery({
        queryKey,
        queryFn: () => apiFetch('/announcements').then(res => res.data as Announcement[]),
    });

    const createMutation = useMutation({
        mutationFn: (data: Omit<Announcement, 'id' | 'createdById' | 'createdAt'>) =>
            apiFetch('/announcements', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return { ...query, createMutation };
}
