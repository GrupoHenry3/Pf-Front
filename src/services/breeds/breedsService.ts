import axios from "axios";
import { getApiUrl } from "@/config/environment";

export interface Breed {
  id: string;
  name: string;
  description: string;
  avatarURL: string;
  speciesID: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBreedDTO {
  name: string;
  description: string;
  avatarURL: string;
  speciesID: string;
}

export interface UpdateBreedDTO {
  name?: string;
  description?: string;
  avatarURL?: string;
  speciesID?: string;
}

const BASE_URL = getApiUrl();

export const breedsService = {
  create: async (data: CreateBreedDTO): Promise<Breed> => {
    const response = await axios.post(`${BASE_URL}/breeds`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  findAll: async (): Promise<Breed[]> => {
    const response = await axios.get<Breed[]>(`${BASE_URL}/breeds`);
    return response.data;
  },

  findOne: async (id: string): Promise<Breed> => {
    const response = await axios.get(`${BASE_URL}/breeds/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateBreedDTO): Promise<Breed> => {
    const response = await axios.patch(`${BASE_URL}/breeds/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${BASE_URL}/breeds/${id}`);
    return response.data;
  },
};
