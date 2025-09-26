import { apiClient } from "../apiClient";
import { Breed } from "@/interfaces/Breed";


export const breedsService = {
  create: async (data: Breed): Promise<Breed> => {
    const response = await apiClient.post(`/breeds`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  findAll: async (): Promise<Breed[]> => {
    const response = await apiClient.get<Breed[]>(`/breeds`);
    return response.data;
  },

  findOne: async (id: string): Promise<Breed> => {
    const response = await apiClient.get(`/breeds/${id}`);
    return response.data;
  },

  update: async (id: string, data: Breed): Promise<Breed> => {
    const response = await apiClient.patch(`/breeds/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/breeds/${id}`);
    return response.data;
  },
};
