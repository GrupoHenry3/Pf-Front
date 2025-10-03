"use client"

import { UserInterface } from "@/interfaces/User"
import { usersService } from "@/services/users/usersService";
import { createContext, useContext, useState, useEffect, useCallback } from "react";



interface UserContextType {
    user: UserInterface | null;
    setUser: (user: UserInterface | null) => void;
    getProfile: () => Promise<void>;
    updateProfile: (userData: Partial<UserInterface>) => Promise<UserInterface>;
    isProfileLoaded: boolean;
    isUserLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    clearError: () => void;
    totalUsers: UserInterface[];
    checkAuthCookie: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalUsers, setTotalUsers] = useState<UserInterface[]>([]);

    const clearError = () => setError(null);

    // Función para verificar si hay cookie de autenticación
    const checkAuthCookie = useCallback(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];
        
        if (!token && user) {
            // No hay cookie pero hay usuario, limpiar
            console.log("🧹 No hay cookie de autenticación, limpiando usuario");
            setUser(null);
            setIsProfileLoaded(false);
        }
        
        return !!token;
    }, [user]);

    const getTotalUsers = async () => {
        const response = await usersService.list();
        setTotalUsers(response);
    }

   useEffect(() => {
    if (user && user.siteAdmin === true) {
        try{
            getTotalUsers();
        } catch (error) {
            console.error("Error al obtener el total de usuarios:", error);
        }
        }
   }, [user]);

   // Verificar cookie de autenticación periódicamente
   useEffect(() => {
        const interval = setInterval(() => {
            checkAuthCookie();
        }, 1000); // Verificar cada segundo

        return () => clearInterval(interval);
   }, [user, checkAuthCookie]);

    const getProfile = async () => {
        try {
            setIsUserLoading(true);
            clearError();
            console.log("Fetching user profile...");
            const response = await usersService.getCurrentUser();
            console.log("User profile fetched successfully:", response);
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

    const updateProfile = async (userData: Partial<UserInterface>): Promise<UserInterface> => {
        try {
            setIsUserLoading(true);
            clearError();
            console.log("Updating user profile...");
            const updatedUser = await usersService.update(userData);
            setUser(updatedUser);
            return updatedUser;
        } catch (error: unknown) {
            console.error("Error updating profile:", error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    useEffect(() => {
        console.log(user);
    }, [user]);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                console.log("UserContext - Initializing user...");
                await getProfile();
                console.log("UserContext - User initialized successfully");
            } catch (error) {
                console.error("UserContext - Error initializing user:", error);
            } finally {
                console.log("UserContext - Setting isInitialized to true");
                setIsInitialized(true);
            }
        };

        initializeUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <UserContext.Provider value={{ 
            user, 
            setUser,  
            getProfile,
            updateProfile,
            isUserLoading, 
            isProfileLoaded, 
            isInitialized,
            error,
            totalUsers,
            clearError,
            checkAuthCookie
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
