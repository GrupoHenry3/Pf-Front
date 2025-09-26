"use client"


import {  petsService } from "@/services/pets/petsService";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { Pet } from "@/interfaces/Pet";

interface PetContextType {
    pets: Pet[];
    setPets: (pets: Pet[]) => void;
    isPetLoading: boolean;
    petsToAdopt: Pet[];
    setPetsToAdopt: (petsToAdopt: Pet[]) => void;
    setIsPetLoading: (isPetLoading: boolean) => void;
    latestPets: Pet[];
    setLatestPets: (latestPets: Pet[]) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [petsToAdopt, setPetsToAdopt] = useState<Pet[]>([]);
    const [latestPets, setLatestPets] = useState<Pet[]>([]);
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

    useEffect(() => {
        const getPetsToAdopt = async () => {
            const pets = await petsService.findAllWithRelations();
            setPetsToAdopt(pets);
        }
        getPetsToAdopt();
    }, []);
    useEffect(() => {
        const latestsPetsArray = pets.slice(-4)
        setLatestPets(latestsPetsArray.reverse());
    }, [pets]);

    return(
        <PetContext.Provider value={{ pets, setPets, isPetLoading, setIsPetLoading, latestPets, setLatestPets, petsToAdopt, setPetsToAdopt }}>
            {children}
        </PetContext.Provider>
    )
}

export const usePet = () => {
    const context = useContext(PetContext);
    if (!context) throw new Error("usePet debe usarse dentro de PetProvider");
    return context;
}