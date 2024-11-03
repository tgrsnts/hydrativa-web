import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { User } from '@/lib/interfaces/User';

interface AuthHookOptions {
    middleware?: 'guest' | 'auth' | 'user';
    redirectIfAuthenticated?: string;
}

interface AuthHookReturn {
    user: User | undefined;
    register: (props: any) => Promise<void>;
    login: (props: any) => Promise<void>;
    forgotPassword: (props: { email: string }) => Promise<void>;
    resendEmailVerification: (props: { setStatus: (status: string) => void }) => void;
    logout: () => Promise<void>;
}

const handleError = (error: any) => {
    if (error.response) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response.data.message || 'An error occurred.',
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Network error. Please try again later.',
        });
    }
};

export const useAuth = ({ middleware, redirectIfAuthenticated }: AuthHookOptions = {}): AuthHookReturn => {
    const router = useRouter();
    const { data: user, error, mutate } = useSWR<User>(`${process.env.NEXT_PUBLIC_API_URL}/me`, () =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => res.data.data)
        .catch(error => {
            if (error.response?.status === 401) {
                // Token is invalid/expired, redirect to login
                localStorage.removeItem('token');
                router.push('/auth/login');
            } else if (error.response?.status === 409) {
                router.push('/verify-email');
            } else {
                throw error; // Propagate error for further handling
            }
        }),
        { revalidateOnMount: true }
    );

    const handleRedirect = () => {
        // Only redirect if there is an error or user is undefined
        if (error) {
            console.log("Error fetching user data, redirecting to /auth/login");
            router.push('/auth/login');
        } else if (middleware === 'auth' && !user) {
            console.log("Redirecting to /auth/login because user is not authenticated");
            router.push('/auth/login');
        } else if (middleware === 'guest' && user && redirectIfAuthenticated) {
            console.log(`Redirecting to ${redirectIfAuthenticated} because user is authenticated`);
            router.push(redirectIfAuthenticated);
        } else if (middleware === 'user' && user) {
            console.log("User is authenticated, no redirect needed");
        }
    };
    

    useEffect(() => {
        handleRedirect();
        console.log(user);
    }, [user, error]);

    const register = async ({ setErrors, setStatus, ...props }: any) => {
        setErrors([]);
        setStatus(null);

        const loadingSwal = Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register`, props);
            setStatus('success');
            Swal.close();
            router.push('/auth/login');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            handleError(error);
        }
    };

    const login = async ({ setErrors, setStatus, ...props }: any) => {
        setErrors([]);
        setStatus(null);

        const loadingSwal = Swal.fire({
            title: 'Loading...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, props);
            const token = response.data.token; // Sesuaikan dengan struktur respons API
            localStorage.setItem('token', token);
            setStatus('success');
            Swal.close();
            mutate(); // Re-fetch user data
            handleRedirect();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            handleError(error);
        }
    };

    const forgotPassword = async ({ setErrors, setStatus, email }: any) => {
        setErrors([]);
        setStatus(null);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, { email });
            setStatus(response.data.status);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            handleError(error);
        }
    };

    const resendEmailVerification = async ({ setStatus }: any) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/email/verification-notification`);
            setStatus(response.data.status);
        } catch (error) {
            handleError(error);
        }
    };

    const logout = async () => {
        localStorage.removeItem('token');
        mutate(undefined); // Reset user data in SWR
        router.push('/auth/login');
    };

    return {
        user,
        register,
        login,
        forgotPassword,
        resendEmailVerification,
        logout,
    };
};
