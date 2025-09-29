"use client"

import { UserInterface } from "@/interfaces/User"
import { usersService } from "@/services/users/usersService";
import { createContext, useContext, useState, useEffect } from "react";



interface UserContextType {
    user: UserInterface | null;
    setUser: (user: UserInterface | null) => void;
    getProfile: () => Promise<void>;
    isProfileLoaded: boolean;
    isUserLoading: boolean;
    isInitialized: boolean;
    error: string | null;
    clearError: () => void;
    totalUsers: UserInterface[];
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
            getProfile, 
            isUserLoading, 
            isProfileLoaded, 
            isInitialized,
            error,
            totalUsers,
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
