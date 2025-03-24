"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { NavBarAdmin } from "../common/navBarAdmin";
import { NavBarStaff } from "../common/navBarStaff";
import { ERoles } from "@/utils/types";
import { IUser } from "@/utils/types";

const AdminLayout = ({ children, role }: { children: React.ReactNode; role: ERoles }) => {
    const { user, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const parsedUser: IUser = storedUser ? JSON.parse(storedUser) : user;

        if (!parsedUser || !('ERoles' in parsedUser)) {
            router.push("/auth/login");
        } else if (!hasRole(role)) {
            const fallbackRoute =
                parsedUser.ERoles?.includes(ERoles.Admin) ? "/dashboard/admin" : "/dashboard/staff";
            router.push(fallbackRoute);
        }
    }, [user, role, hasRole, router]);

    if (!user || !hasRole(role)) {
        return null;
    }

    return (
        <div className="home-layout h-screen flex flex-col">
            <header className="block w-full mx-auto bg-white bg-opacity-60 sticky top-0 shadow backdrop-blur-lg backdrop-saturate-150 z-[99]">
                {role === ERoles.Admin ? <NavBarAdmin /> : <NavBarStaff />}
            </header>
            <main className="flex flex-1 w-full items-start justify-center relative pt-8 bg-white dark:bg-black">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
