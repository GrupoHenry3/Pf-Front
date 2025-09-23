"use client"

import { UserInterface } from "@/interfaces/User"
import { authService } from "@/services/auth/authService";
import { usersService } from "@/services/users/usersService";
import { createContext, useContext, useState, useEffect } from "react";

interface AxiosError {
    response?: {
        status?: number;
        data?: {
            message?: string;
        };
    };
}

interface UserContextType {
    user: UserInterface | null;
    setUser: (user: UserInterface | null) => void;
    getProfile: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string, confirmedPassword: string) => Promise<UserInterface>;
    isProfileLoaded: boolean;
    isUserLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    const login = async (email: string, password: string) => {
        try {
            clearError();
            console.log("Attempting login...");
            const loginResponse = await authService.login({ email, password });
            console.log("Login response:", loginResponse);
            console.log("Getting profile after login...");
            await getProfile();
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
            await getProfile();
            return newUser;
        } catch (error: unknown) {
            console.error("Error during registration:", error);
            const errorMessage = (error as AxiosError)?.response?.data?.message || "Error al registrarse";
            setError(errorMessage);
            throw error;
        }
    }

    const getProfile = async () => {
        try {
            setIsUserLoading(true);
            clearError();
            console.log("Fetching user profile...");
            const response = await usersService.getCurrentUser();
            setUser(response);
            setIsProfileLoaded(true);
        } catch (error: unknown) {
            console.error("Error fetching profile:", error);
            setUser(null);
            setIsProfileLoaded(true);
        } finally {
            setIsUserLoading(false);
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
        } finally {
            setUser(null);
            setIsProfileLoaded(false);
            setIsInitialized(true);
        }
    }

    useEffect(() => {
        const initializeUser = async () => {
            try {
                await getProfile();
            } catch (error) {
                console.error("Error initializing user:", error);
            } finally {
                setIsInitialized(true);
            }
        };

        initializeUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser, 
            register, 
            logout, 
            getProfile, 
            login, 
            isUserLoading, 
            isProfileLoaded, 
            isInitialized,
            error,
            clearError
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
    return context;
};
