"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { donationsService } from "@/services/donations/donationsService";
import { Donation } from "@/interfaces/Donation";

interface DonationContextType {
    donations: Donation[];
    shelterDonations: Donation[];
    userDonations: Donation[];
    setDonations: (donations: Donation[]) => void;
    isDonationLoading: boolean;
    setShelterDonations: (shelterDonations: Donation[]) => void;
    setUserDonations: (userDonations: Donation[]) => void;
    setIsDonationLoading: (isDonationLoading: boolean) => void;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

export const DonationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [shelterDonations, setShelterDonations] =useState<Donation[]>([])
    const [userDonations, setUserDonations] =useState<Donation[]>([])
    const [isDonationLoading, setIsDonationLoading] = useState(false);
    
    useEffect(() => {
        const getDonations = async () => {
            try{
                if(user && user.siteAdmin){
                const donations = await donationsService.getAll();
                setDonations(donations);
            }
            } catch (error) {
                console.error("Error al cargar donaciones:", error);
                setDonations([]);
            } finally {
                setIsDonationLoading(false);
            }
        }
        getDonations();
    }, [user]);

    useEffect(() => {
        console.log(userDonations);
    }, [userDonations]);

    
    useEffect(() => {
        if(user && user.userType === "Shelter"){
        const getShelterDonations = async () => {
            const donations = await donationsService.findByShelter();
            setShelterDonations(donations);
        }
        getShelterDonations();
        }
    }, [user]);

    useEffect(() => {
        const getUserDonations = async () => {
            try{
                if(user && user.userType === "User"){
                    const donations = await donationsService.findByUser();
                    setUserDonations(donations);
                }
            } catch (error) {
                console.error("Error al cargar donaciones del usuario:", error);
                setUserDonations([]);
            } finally {
                setIsDonationLoading(false);
            }
        }
        getUserDonations();
    }, [user]);

    return (
        <DonationContext.Provider value={{ donations, setDonations, isDonationLoading, setIsDonationLoading, shelterDonations, userDonations, setShelterDonations, setUserDonations }}>
            {children}
        </DonationContext.Provider>
    );
};

export const useDonation = () => {
    const context = useContext(DonationContext);
    if (!context) {
        throw new Error('useDonation must be used within a DonationProvider');
    }
    return context;
};