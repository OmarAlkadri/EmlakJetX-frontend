/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ERoles, IUser } from "@/utils/types";
import { usePathname } from "next/navigation";
import HomeLayout from "./HomeLayout";
import AdminLayout from "./AdminLayout";
import EmployeeLayout from "./EmployeeLayout";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const { user, hasRole } = useAuth();
    const [parsedUser, setParsedUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const authPages = useMemo(() => ["/auth/login", "/auth/register"], []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            setParsedUser(storedUser ? JSON.parse(storedUser) : user);
            setIsLoading(false);
        }
    }, [user]);

    const layout = useMemo(() => {
        if (authPages.includes(pathname)) {
            return <>{children}</>;
        }

        if (isLoading) {
            return <div className="flex items-center justify-center h-screen">Loading...</div>;
        }

        if (!parsedUser) {
            return <HomeLayout>{children}</HomeLayout>;
        }

        if (hasRole(ERoles.Admin)) {
            return <AdminLayout role={ERoles.Admin}>{children}</AdminLayout>;
        }

        if (hasRole(ERoles.Employee)) {
            return <EmployeeLayout role={ERoles.Employee}>{children}</EmployeeLayout>;
        }

        return <HomeLayout>{children}</HomeLayout>; // fallback
    }, [pathname, isLoading, parsedUser, hasRole, children, authPages]);

    return <main>{layout}</main>;
};

export default DashboardLayout;
