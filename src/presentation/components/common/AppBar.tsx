import React from "react";
import Link from "next/link";
export default function AppBar() {
    return (
        <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-lg font-bold">Dynamic App</h1>
                <nav className="space-x-4">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <Link href="/dashboard" className="hover:underline">
                        Dashboard
                    </Link>
                </nav>
            </div>
        </header>
    );
}
