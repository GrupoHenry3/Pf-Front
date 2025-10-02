"use client"


import {  petsService } from "@/services/pets/petsService";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { Pet } from "@/interfaces/Pet";

interface PetContextType {
    allPets: Pet[];
    setShelterPets: (shelterPets: Pet[]) => void;
    setAllPets: (allPets: Pet[]) => void;
    isPetLoading: boolean;
    petsToAdopt: Pet[];
    setPetsToAdopt: (petsToAdopt: Pet[]) => void;
    setIsPetLoading: (isPetLoading: boolean) => void;
    shelterPets: Pet[];
    latestPets: Pet[];
    setLatestPets: (latestPets: Pet[]) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shelterPets, setShelterPets] = useState<Pet[]>([]);
    const [allPets, setAllPets] = useState<Pet[]>([]);
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
                    setShelterPets(pets);
                } catch (error) {
                    console.error("Error al cargar mascotas del shelter:", error);
                    setShelterPets([]);
                } finally {
                    setIsPetLoading(false);
                }
            }
            getPetsByShelter();
        } else {
            setShelterPets([]);
        }
    }, [user]); 

    useEffect(()=>{
        console.log(shelterPets);
    }, [shelterPets]);

    useEffect(()=>{
        const getAllPets = async()=>{
            try{
                setIsPetLoading(true);
                const pets = await petsService.findAllWithRelations();
                setAllPets(pets);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
                setAllPets([]);
            } finally {
                setIsPetLoading(false);
            }
        }
        getAllPets();
    },[])


    useEffect(() => {
        const getPetsToAdopt = async () => {
            const pets = await petsService.findAllWithRelations();
            setPetsToAdopt(pets);
        }
        getPetsToAdopt();
    }, []);
    
    useEffect(()=>{
        console.log(allPets);
    }, [allPets]);


    useEffect(() => {
        const getLatestPets = async () => {
            const pets = await petsService.findAllWithRelations();
            setLatestPets(pets);
        }
        getLatestPets();
    }, []);
    useEffect(() => {
        const latestsPetsArray = shelterPets.slice(-4)
        setLatestPets(latestsPetsArray.reverse());
    }, [shelterPets]);

    return(
        <PetContext.Provider value={{ shelterPets, setShelterPets, setAllPets, allPets, setIsPetLoading, latestPets, setLatestPets, petsToAdopt, setPetsToAdopt, isPetLoading }}>
            {children}
        </PetContext.Provider>
    )
}

export const usePet = () => {
    const context = useContext(PetContext);
    if (!context) throw new Error("usePet debe usarse dentro de PetProvider");
    return context;
}