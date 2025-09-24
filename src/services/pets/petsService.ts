import axios from "axios";
import { getApiUrl } from "@/config/environment";
import { Pet, PetWithRelations } from "@/interfaces/Pet";

// Interfaz para mascotas con relaciones del backend


export interface PetFilters {
  skip?: number;
  take?: number;
}

const BASE_URL = getApiUrl();

export const petsService = {
  create: async (data: Pet): Promise<Pet> => {
    const response = await axios.post(`${BASE_URL}/pets`, data);
    return response.data;
  },

  findAll: async (filters: PetFilters = {}): Promise<PetWithRelations[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `${BASE_URL}/pets${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<PetWithRelations[]>(url);
    return response.data;
  },

  findAllByShelter: async (id: string): Promise<PetWithRelations[]> => {
    const response = await axios.get(`${BASE_URL}/pets/shelter/${id}`);
    return response.data;
  },

  findOne: async (id: string): Promise<PetWithRelations> => {
    const response = await axios.get(`${BASE_URL}/pets/${id}`);
    return response.data;
  },

  findAllWithInactive: async (filters: PetFilters = {}): Promise<Pet[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `${BASE_URL}/pets/all${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<Pet[]>(url, {
      withCredentials: true,
    });
    return response.data;
  },

};
