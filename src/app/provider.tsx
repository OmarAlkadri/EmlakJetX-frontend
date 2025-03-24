// src/app/provider.tsx
"use client";
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/infrastructure/apolloClient";
import ToastProvider from './ToastProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ApolloProvider client={apolloClient}>
            <AuthProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </AuthProvider>
        </ApolloProvider>
    );
}
