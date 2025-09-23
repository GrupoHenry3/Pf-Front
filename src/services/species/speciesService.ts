import axios from "axios";
import { getApiUrl } from "@/config/environment";

export interface Species {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpeciesDTO {
  name: string;
}

export interface UpdateSpeciesDTO {
  name: string;
}

const BASE_URL = getApiUrl();

export const speciesService = {
  create: async (data: CreateSpeciesDTO): Promise<Species> => {
    const response = await axios.post(`${BASE_URL}/species`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  findAll: async (): Promise<Species[]> => {
    const response = await axios.get<Species[]>(`${BASE_URL}/species`);
    return response.data;
  },

  findOne: async (id: string): Promise<Species> => {
    const response = await axios.get(`${BASE_URL}/species/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateSpeciesDTO): Promise<Species> => {
    const response = await axios.patch(`${BASE_URL}/species/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${BASE_URL}/species/${id}`);
    return response.data;
  },
};
