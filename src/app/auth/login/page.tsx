/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import './login.css';
import Link from 'next/link';
import Loader from "@/presentation/components/common/Loader";
import { ERoles } from '@/utils/types';

type LoginFormInputs = {
    email: string;
    password: string;
};

const LoginPage = () => {
    const { login, user } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        setError
    } = useForm<LoginFormInputs>({
        mode: "onChange"
    });

    useEffect(() => {
        if (user?.ERoles?.includes(ERoles.Admin)) {
            router.push('/dashboard/admin');
        } else if (user?.ERoles?.includes(ERoles.Staff)) {
            router.push('/dashboard/staff');
        } else if (user?.ERoles?.includes(ERoles.Employee)) {
            router.push('/dashboard/employee');
        } else {
            setError("email", { type: "manual", message: "No matching role for redirection." });
        }
    }, [user])
    const onSubmit = async (data: LoginFormInputs) => {
        try {
            await login(data);


        } catch (error: any) {
            setError("email", { type: "manual", message: error.message || "Invalid credentials. Please try again." });
        }
    };

    return (
        <Loader loaded={!isSubmitting} onlySpinner={false}>
            <div className='w-full h-screen flex justify-center items-center'>
                <section className="bg-gray-50 dark:bg-gray-900 w-full max-w-md p-6 rounded-lg shadow-lg">
                    <h1 className="text-xl font-bold text-gray-900 text-center mb-4">
                        Sign in to your account
                    </h1>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                Your email
                            </label>
                            <input
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email format.",
                                    },
                                })}
                                type="email"
                                id="email"
                                className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} 
                                    text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                                placeholder="name@company.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Password
                            </label>
                            <input
                                {...register("password", {
                                    required: "Password is required.",
                                })}
                                type="password"
                                id="password"
                                placeholder="••••••••"
                                className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} 
                                    text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div className='flex flex-col gap-y-4'>
                            <button
                                type="submit"
                                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50"
                                disabled={isSubmitting || !isValid}
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </button>

                            <Link
                                href={'/register'}
                                className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </form>
                </section>
            </div>
        </Loader>
    );
};

export default LoginPage;
