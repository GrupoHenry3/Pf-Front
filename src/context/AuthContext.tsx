"use client"
import { UserInterface } from "@/interfaces/User";
import { authService } from "@/services/auth/authService";
import { createContext, useContext, useState } from "react";


interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    register: (fullName: string, email: string, password: string, confirmedPassword: string) => Promise<UserInterface>;
    logout: () => Promise<void>;
}
interface AxiosError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const login = async (email: string, password: string) => {
        try {
            console.log("Attempting login...");
            clearError();
            const loginResponse = await authService.login({ email, password });
            console.log("Login response:", loginResponse);
            console.log("Getting profile after login...");
        } catch (error: unknown) {
            console.error("Error during login:", error);
            const errorMessage = (error as AxiosError)?.response?.data?.message || "Error al iniciar sesión";
            setError(errorMessage);
            throw error;
        }
    }

    const register = async (fullName: string, email: string, password: string, confirmedPassword: string): Promise<UserInterface> => {
        try {
            clearError();
            const newUser = await authService.register({ fullName, email, password, confirmedPassword });
            return newUser;
        } catch (error: unknown) {
            console.error("Error during registration:", error);
            const errorMessage = (error as AxiosError)?.response?.data?.message || "Error al registrarse";
            setError(errorMessage);
            throw error;
        }
    }
    const logout = async () => {
        try {
            clearError();
            await authService.logout();
        } catch (error: unknown) {
            console.error("Error during logout:", error);
            const errorMessage = (error as AxiosError)?.response?.data?.message || "Error al cerrar sesión";
            setError(errorMessage);
        }
    }

    return (
        <AuthContext.Provider value={{ login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}