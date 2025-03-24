"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, LoginCredentials, UserResponse } from "@/app/api/auth/login";
import { logout as apiLogout } from "@/app/api/auth/logout";
import { useRouter } from "next/navigation";
import { ERoles, IUser } from "@/utils/types";



type AuthContextType = {
    user: IUser | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    hasRole: (role: ERoles) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const userData: UserResponse = await apiLogin(credentials);
            const transformedUser = {
                _id: userData.user._id,
                name: userData.user.name,
                email: userData.user.email,
                ERoles: userData.user.ERoles || [],
                EUserType: userData.user.EUserType,
                phoneNumber: userData.user.phoneNumber,
                access_token: userData.access_token,
                password: "",
                createdAt: userData.user.createdAt,
                updatedAt: userData.user.updatedAt,
            };
            setUser(transformedUser);
            localStorage.setItem("user", JSON.stringify(transformedUser));
            localStorage.setItem("authToken", userData.access_token);
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        try {
            apiLogout();
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            router.push("http://localhost:3000");
        } catch (error) {
            console.error("Logout failed:", error);
            throw error;
        }
    };

    const hasRole = (role: ERoles): boolean => user?.ERoles?.includes(role) ?? false;

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
