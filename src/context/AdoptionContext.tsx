"use client"

import { createContext, useContext, useState, useEffect } from "react";

import {AdminAdoptions, adoptionsService, AdoptionWithRelations } from "@/services/adoptions/adoptionsService";
import { useUser } from "./UserContext";

interface AdoptionContextType {
  shelterAdoptions: AdoptionWithRelations[];
  allAdoptions: AdminAdoptions[];
  setAllAdoptions: (allAdoptions: AdminAdoptions[]) => void;
  setShelterAdoptions: (shelterAdoptions: AdoptionWithRelations[]) => void;
  isAdoptionsLoading: boolean;
  setIsAdoptionsLoading: (loading: boolean) => void;
  latestAdoptions: AdoptionWithRelations[];
  setLatestAdoptions: (latestAdoptions: AdoptionWithRelations[]) => void;
}

const AdoptionContext = createContext<AdoptionContextType | undefined>(undefined);

export const AdoptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelterAdoptions, setShelterAdoptions] = useState<AdoptionWithRelations[]>([]);
  const [isAdoptionsLoading, setIsAdoptionsLoading] = useState(false);
  const [allAdoptions, setAllAdoptions] = useState<AdminAdoptions[]>([]);
  const [latestAdoptions, setLatestAdoptions] = useState<AdoptionWithRelations[]>([]);
  const { user } = useUser();




  useEffect(() => {
    setLatestAdoptions(shelterAdoptions.slice(-4).reverse());
  }, [shelterAdoptions]);

  useEffect(() => {
    const fetchAdoptionsByShelter = async () => {
      if (user && user.userType === "Shelter" && user.shelter?.id) {
        setIsAdoptionsLoading(true);
        try {
          const response = await adoptionsService.findByShelterId(user.shelter.id);
          setShelterAdoptions(response.data);
        } catch (error) {
          console.error("Error al cargar adopciones del shelter:", error);
          setShelterAdoptions([]);
        } finally {
          setIsAdoptionsLoading(false);
        }
      } else {
        setShelterAdoptions([]);
      }
    };
    fetchAdoptionsByShelter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);


  useEffect(() => {
    if(user && user.siteAdmin ===true){
      const getAllAdoptions = async () => {
        const adoptions = await adoptionsService.findAll();
        setAllAdoptions(adoptions);
      }
      getAllAdoptions();
    }
  },[user])


  useEffect(() => {
    console.log(allAdoptions);
  }, [allAdoptions]);

  return (
    <AdoptionContext.Provider
      value={{
        allAdoptions,
        setAllAdoptions,
        shelterAdoptions,
        setShelterAdoptions,
        isAdoptionsLoading,
        setIsAdoptionsLoading,
        latestAdoptions,
        setLatestAdoptions,
      }}
    >
      {children}
    </AdoptionContext.Provider>
  );
};

export const useAdoption = () => {
  const context = useContext(AdoptionContext);
  if (!context) throw new Error("useAdoption debe usarse dentro de AdoptionProvider");
  return context;
};
