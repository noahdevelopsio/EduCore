'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useReactHookForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../stores/authStore';

const loginSchema = z.object({
    emailOrPhone: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useReactHookForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setError(null);
            // Dummy endpoint for Phase 1 simulation until API proxy is configured
            const res = await fetch('http://localhost:3000/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const body = await res.json();
            if (!body.success) {
                throw new Error(body.message || 'Login failed');
            }

            setAuth(body.data.user, body.data.accessToken);

            // Route based on role
            switch (body.data.user.role) {
                case 'SUPER_ADMIN':
                case 'SCHOOL_ADMIN':
                    router.push('/admin');
                    break;
                case 'TEACHER':
                    router.push('/teacher');
                    break;
                case 'STUDENT':
                    router.push('/student');
                    break;
                case 'PARENT':
                    router.push('/parent');
                    break;
                default:
                    router.push('/dashboard');
            }

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center bg-neutral-50 p-4">
            <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg shadow-card p-6">
                <h1 className="font-display text-2xl font-bold text-neutral-800 text-center mb-6">Log in to EduCore</h1>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 font-body text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block font-body text-sm font-semibold text-neutral-700 mb-2">Email or Phone Number</label>
                        <input
                            {...register('emailOrPhone')}
                            type="text"
                            placeholder="e.g. jdoe@school.com or 08012345678"
                            className={`w-full font-body text-base text-neutral-800 bg-white border-[1.5px] rounded-md px-4 py-3 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500/25 ${errors.emailOrPhone ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-500'}`}
                        />
                        {errors.emailOrPhone && <p className="text-xs text-red-500 mt-1">{errors.emailOrPhone.message}</p>}
                    </div>

                    <div>
                        <label className="block font-body text-sm font-semibold text-neutral-700 mb-2">Password</label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="Enter your password"
                            className={`w-full font-body text-base text-neutral-800 bg-white border-[1.5px] rounded-md px-4 py-3 outline-none transition-colors placeholder:text-neutral-400 focus:ring-2 focus:ring-primary-500/25 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-neutral-200 focus:border-primary-500'}`}
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-body font-semibold text-sm px-5 py-3 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-neutral-300 mt-2"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
