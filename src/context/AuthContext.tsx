"use client"
import { UserInterface } from "@/interfaces/User";
import { authService } from "@/services/auth/authService";
import { createContext, useContext } from "react";


interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    register: (fullName: string, email: string, password: string, confirmedPassword: string) => Promise<UserInterface>;
    logout: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const login = async (email: string, password: string) => {
        try {
            console.log("Attempting login...");
          
            const loginResponse = await authService.login({ email, password });
            console.log("Login response:", loginResponse);
            console.log("Getting profile after login...");
        } catch (error: unknown) {
            console.error("Error during login:", error);
            throw error;
        }
    }

    const register = async (fullName: string, email: string, password: string, confirmedPassword: string): Promise<UserInterface> => {
        try {
            const newUser = await authService.register({ fullName, email, password, confirmedPassword });
            return newUser;
        } catch (error: unknown) {
            console.error("Error during registration:", error);
            throw error;
        }
    }
    const logout = async () => {
        try {
            await authService.logout();
        } catch (error: unknown) {
            console.error("Error during logout:", error);
            throw error;
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