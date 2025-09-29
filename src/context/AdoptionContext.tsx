"use client"

import { createContext, useContext, useState, useEffect } from "react";

import { AdoptionDTO, adoptionsService, AdoptionWithRelations } from "@/services/adoptions/adoptionsService";
import { useUser } from "./UserContext";

interface AdoptionContextType {
  shelterAdoptions: AdoptionWithRelations[];
  setShelterAdoptions: (shelterAdoptions: AdoptionWithRelations[]) => void;
  userAdoptions: AdoptionWithRelations[];
  setUserAdoptions: (userAdoptions: AdoptionWithRelations[]) => void;
  isAdoptionsLoading: boolean;
  setIsAdoptionsLoading: (loading: boolean) => void;
  fetchAdoptionsByShelter: () => Promise<void>;
  latestAdoptions: AdoptionWithRelations[];
  createAdoption: (adoption: AdoptionDTO) => Promise<void>;
  setLatestAdoptions: (latestAdoptions: AdoptionWithRelations[]) => void;
}

const AdoptionContext = createContext<AdoptionContextType | undefined>(undefined);

export const AdoptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shelterAdoptions, setShelterAdoptions] = useState<AdoptionWithRelations[]>([]);
  const [userAdoptions, setUserAdoptions] = useState<AdoptionWithRelations[]>([]);
  const [isAdoptionsLoading, setIsAdoptionsLoading] = useState(false);
  const [latestAdoptions, setLatestAdoptions] = useState<AdoptionWithRelations[]>([]);
  const { user } = useUser();

  const fetchAdoptionsByShelter = async () => {
    if (user && user.userType === "Shelter" && user.shelter?.id) {
      setIsAdoptionsLoading(true);
      try {
        const response = await adoptionsService.findByShelterId(user.shelter.id);
        setShelterAdoptions(response.data || []);
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

  const createAdoption = async (adoption: AdoptionDTO) => {
    const response = await adoptionsService.create(adoption);
    setUserAdoptions([...userAdoptions, response.data as AdoptionWithRelations]);
  };

 useEffect(() => {
  setUserAdoptions(user?.adoptions || []);
 }, [user]);

  useEffect(() => {
    setLatestAdoptions(shelterAdoptions.slice(-4).reverse());
  }, [shelterAdoptions]);

  useEffect(() => {
    fetchAdoptionsByShelter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <AdoptionContext.Provider
      value={{
        createAdoption,
        shelterAdoptions,
        setShelterAdoptions,
        userAdoptions,
        setUserAdoptions,
        isAdoptionsLoading,
        setIsAdoptionsLoading,
        fetchAdoptionsByShelter,
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
