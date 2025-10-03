import { apiClient } from "../apiClient";
import { CreatePetData, Pet } from "@/interfaces/Pet";
import toast from "react-hot-toast";

export interface PetFilters {
  skip?: number;
  take?: number;
}

export const petsService = {
  create: async (data: CreatePetData): Promise<CreatePetData> => {
    try {
      const response = await apiClient.post('/pets', data);
      toast.success("Mascota creada exitosamente");
      return response.data;
    } catch (error) {
      toast.error("Error al crear la mascota");
      throw error;
    }
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

  update: async (id: string, data: Partial<CreatePetData>): Promise<Pet> => {
    try {
      const response = await apiClient.patch(`/pets/${id}`, data);
      toast.success("Mascota actualizada exitosamente");
      return response.data;
    } catch (error) {
      toast.error("Error al actualizar la mascota");
      throw error;
    }
  },

  updateStatus: async (id: string): Promise<Pet> => {
    try {
      const response = await apiClient.patch(`/pets/${id}/status`);
      toast.success("Estado de mascota actualizado");
      return response.data;
    } catch (error) {
      toast.error("Error al actualizar el estado de la mascota");
      throw error;
    }
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
