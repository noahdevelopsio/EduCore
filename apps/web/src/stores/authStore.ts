import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT';

interface User {
    id: string;
    role: Role;
    schoolId: string;
    email?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),
            clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
        }),
        {
            name: 'educore-auth', // stored in localStorage
            partialize: (state) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
