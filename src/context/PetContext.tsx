"use client"


import {  petsService } from "@/services/pets/petsService";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import {  PetWithRelations } from "@/interfaces/Pet";

interface PetContextType {
    pets: PetWithRelations[];
    setPets: (pets: PetWithRelations[]) => void;
    isPetLoading: boolean;
    setIsPetLoading: (isPetLoading: boolean) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pets, setPets] = useState<PetWithRelations[]>([]);
    const { user } = useUser();
    const [isPetLoading, setIsPetLoading] = useState(false);

    useEffect(() => {
        if(user && user.userType === "Shelter" && user.shelter?.id){
            const getPetsByShelter = async () => {
                try {
                    setIsPetLoading(true);
                    const pets = await petsService.findAllByShelter(user.shelter?.id || "");
                    setPets(pets);
                } catch (error) {
                    console.error("Error al cargar mascotas del shelter:", error);
                    setPets([]);
                } finally {
                    setIsPetLoading(false);
                }
            }
            getPetsByShelter();
        } else {
            setPets([]);
        }
    }, [user]); 

    return(
        <PetContext.Provider value={{ pets, setPets, isPetLoading, setIsPetLoading }}>
            {children}
        </PetContext.Provider>
    )
}

export const usePet = () => {
    const context = useContext(PetContext);
    if (!context) throw new Error("usePet debe usarse dentro de PetProvider");
    return context;
}