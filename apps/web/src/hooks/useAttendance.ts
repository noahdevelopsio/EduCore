import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface AttendanceRecord {
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
}

export interface AttendanceData {
    id: string;
    schoolId: string;
    studentId: string;
    classId: string;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
    markedById: string;
    syncedAt: string | null;
    createdAt: string;
    student?: {
        id: string;
        firstName: string;
        lastName: string;
        admissionNumber: string;
    };
}

export function useAttendance(classId: string, date: string) {
    const queryClient = useQueryClient();
    const queryKey = ['attendance', classId, date];

    const query = useQuery({
        queryKey,
        queryFn: () => apiFetch(`/attendance/class/${classId}?date=${date}`).then(res => res.data as AttendanceData[]),
        enabled: !!classId && !!date,
    });

    const markMutation = useMutation({
        mutationFn: (data: { classId: string; date: string; records: AttendanceRecord[] }) =>
            apiFetch('/attendance/mark', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    return { ...query, markMutation };
}
