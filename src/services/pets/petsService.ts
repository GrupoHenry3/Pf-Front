import { apiClient } from "../apiClient";
import { Pet } from "@/interfaces/Pet";

export interface PetFilters {
  skip?: number;
  take?: number;
}

export const petsService = {
  create: async (data: Pet): Promise<Pet> => {
    const response = await apiClient.post('/pets', data);
    return response.data;
  },

  findAll: async (filters: PetFilters = {}): Promise<Pet[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `/pets${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<Pet[]>(url);
    return response.data;
  },

  findAllWithRelations: async (filters: PetFilters = {}): Promise<Pet[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `/pets${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<Pet[]>(url);
    return response.data;
  },

  findAllByShelter: async (id: string): Promise<Pet[]> => {
    const response = await apiClient.get(`/pets/shelter/${id}`);
    return response.data;
  },

  findOne: async (id: string): Promise<Pet> => {
    const response = await apiClient.get(`/pets/${id}`);
    return response.data;
  },

  findAllWithInactive: async (filters: PetFilters = {}): Promise<Pet[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `/pets/all${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<Pet[]>(url);
    return response.data;
  },

};
