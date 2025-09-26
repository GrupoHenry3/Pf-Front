"use client";

import { Species } from "@/interfaces/Species";
import { speciesService } from "@/services/species/speciesService";
import { createContext, useContext, useState, useEffect } from "react";

interface SpeciesContextType {
    species: Species[];
    setSpecies: (species: Species[]) => void;
    isSpeciesLoading: boolean;
    setIsSpeciesLoading: (isSpeciesLoading: boolean) => void;
    createSpecies: (speciesData: Species) => Promise<Species>;
}

const SpeciesContext = createContext<SpeciesContextType | undefined>(undefined);

export const SpeciesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
    const [species, setSpecies] = useState<Species[]>([]);
    const [isSpeciesLoading, setIsSpeciesLoading] = useState(false);

    useEffect(() => {
        const getSpecies = async () => {
            try{
                setIsSpeciesLoading(true);
                const species = await speciesService.findAll();
                setSpecies(species);
            } catch (error) {
                console.error("Error fetching species:", error);
            } finally {
                setIsSpeciesLoading(false);
            }
        }
        getSpecies();
    }, []);

    const createSpecies = async (speciesData: Species) => {
        const newSpecies = await speciesService.create(speciesData);
        setSpecies([...species, newSpecies]);
        return newSpecies;
    }

    return (
        <SpeciesContext.Provider value={{ species, setSpecies, isSpeciesLoading, setIsSpeciesLoading, createSpecies }}>
            {children}
        </SpeciesContext.Provider>
    )
}

export const useSpecies = () => {
    const context = useContext(SpeciesContext);
    if (!context) {
        throw new Error("useSpecies must be used within a SpeciesProvider");
    }
    return context;
}
 