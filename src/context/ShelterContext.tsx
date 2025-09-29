"use client";

import { Shelter } from "@/interfaces/Shelter"
import { sheltersService } from "@/services/shelters/sheltersService";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";


interface ShelterContextType {
    shelters: Shelter[];
    createShelter: (shelter: Shelter) => void;
    setShelters: (shelters: Shelter[]) => void;
    getShelters: () => Promise<void>;
}

const ShelterContext = createContext<ShelterContextType | undefined>(undefined);


export const ShelterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shelters, setShelters] = useState<Shelter[]>([]);
    const { getProfile } = useUser();

    const getShelters = async () => {
        try {
            const shelters = await sheltersService.findAll();
            setShelters(shelters);    
        } catch (error) {
            console.error("Error fetching shelters:", error);
        }           
    }

    useEffect(() => {
        getShelters();
    }, []);

    const createShelter = async (shelterData: Shelter) => {
        const newShelter = await sheltersService.create({
            name: shelterData.name,
            address: shelterData.address,
            phoneNumber: shelterData.phoneNumber,
            city: shelterData.city,
            state: shelterData.state,
            country: shelterData.country
        });
        setShelters([...shelters, newShelter]);
        await getProfile();
    }

    return(
        <ShelterContext.Provider value={{ shelters, setShelters, createShelter, getShelters }}>
            {children}
        </ShelterContext.Provider>
    )
}

export const useShelter = () => {
    const context = useContext(ShelterContext);
    if (!context) throw new Error("useShelter debe usarse dentro de ShelterProvider");
    return context;
}
