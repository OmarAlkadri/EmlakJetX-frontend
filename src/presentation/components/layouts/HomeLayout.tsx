// src/presentation/components/layouts/HomeLayout.tsx
"use client";
import React from 'react';
import { NavBar } from '../common/navBar';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="home-layout h-full flex flex-col ">
            <header className="block w-full mx-auto bg-white bg-opacity-60 sticky top-0 shadow backdrop-blur-lg backdrop-saturate-150 z-[99]">
                <NavBar />
            </header>
            <main className='w-full flex flex-1 items-start justify-center relative bg-white dark:bg-black'>
                {children}
            </main>
        </div>
    );
};

export default HomeLayout;
