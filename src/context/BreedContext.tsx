"use client";

import { Breed } from "@/interfaces/Breed";
import { breedsService } from "@/services/breeds/breedsService";
import { createContext, useContext, useState, useEffect } from "react";

interface BreedContextType {
    breeds: Breed[];
    setBreeds: (breeds: Breed[]) => void;
    isBreedsLoading: boolean;
    createBreed: (breed: Breed) => Promise<Breed>;
    setIsBreedsLoading: (isBreedsLoading: boolean) => void;
}

const BreedContext = createContext<BreedContextType | undefined>(undefined);

export const BreedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
    const [breeds, setBreeds] = useState<Breed[]>([]);
    const [isBreedsLoading, setIsBreedsLoading] = useState(false);

    useEffect(() => {
        const getBreeds = async () => {
            try{
                setIsBreedsLoading(true);
                const breeds = await breedsService.findAll();
                setBreeds(breeds);
            } catch (error) {
                console.error("Error fetching species:", error);
            } finally {
                setIsBreedsLoading(false);
            }
        }
        getBreeds();
    }, []);


    const createBreed = async (breed: Breed) => {
        const newBreed = await breedsService.create(breed);
        setBreeds([...breeds, newBreed]);
        return newBreed;
    }

    return (    
        <BreedContext.Provider value={{ breeds, setBreeds, isBreedsLoading, setIsBreedsLoading, createBreed }}>
            {children}
        </BreedContext.Provider>
    )
}

export const useBreeds = () => {
    const context = useContext(BreedContext);
    if (!context) {
        throw new Error("useBreeds must be used within a BreedProvider");
    }
    return context;
}
 