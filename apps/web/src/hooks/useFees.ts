import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';

export interface FeeStructure {
    id: string;
    name: string;
    amount: number;
    term: number;
    academicYear: string;
    classId?: string;
    class?: { name: string };
}

export interface FeePayment {
    id: string;
    studentId: string;
    feeStructureId: string;
    amountPaid: number;
    paymentDate: string;
    method: string;
    reference: string;
    status: string;
    student?: { firstName: string, lastName: string, admissionNumber: string };
    feeStructure?: { name: string, amount: number };
}

export interface DashboardStats {
    totalStudents: number;
    attendanceToday: number;
    totalFeesCollected: number;
}

export function useFees() {
    const queryClient = useQueryClient();

    const structuresQuery = useQuery({
        queryKey: ['fee-structures'],
        queryFn: () => apiFetch('/fees/structures').then(res => res.data as FeeStructure[]),
    });

    const createStructureMutation = useMutation({
        mutationFn: (data: Omit<FeeStructure, 'id' | 'class'>) =>
            apiFetch('/fees/structure', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fee-structures'] }),
    });

    const recordPaymentMutation = useMutation({
        mutationFn: (data: any) =>
            apiFetch('/fees/payment', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fee-payments'] }),
    });

    const statsQuery = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: () => apiFetch('/fees/stats').then(res => res.data as DashboardStats),
    });

    return {
        structures: structuresQuery.data,
        isLoadingStructures: structuresQuery.isLoading,
        createStructure: createStructureMutation.mutate,
        isCreatingStructure: createStructureMutation.isPending,
        recordPayment: recordPaymentMutation.mutate,
        isRecordingPayment: recordPaymentMutation.isPending,
        stats: statsQuery.data,
        isLoadingStats: statsQuery.isLoading,
    };
}
