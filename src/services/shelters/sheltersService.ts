import { Shelter } from "@/interfaces/Shelter";
import axios from "axios";
import { getApiUrl } from "@/config/environment";

interface CreateShelterData {
  name: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
}

interface GetSheltersFilters {
  country?: string;
  state?: string;
  city?: string;
}

interface UpdateShelterData {
  name?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  description?: string;
}

const BASE_URL = getApiUrl();

export const sheltersService = {
  create: async (data: CreateShelterData): Promise<Shelter> => {
    const response = await axios.post(`${BASE_URL}/shelters`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  findAll: async (filters: GetSheltersFilters = {}): Promise<Shelter[]> => {
    const params = new URLSearchParams();
    if (filters.country) params.set("country", filters.country);
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    
    const url = `${BASE_URL}/shelters${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<Shelter[]>(url);
    return response.data;
  },

  findOne: async (id: string): Promise<Shelter> => {
    const response = await axios.get(`${BASE_URL}/shelters/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateShelterData): Promise<Shelter> => {
    const response = await axios.patch(`${BASE_URL}/shelters/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  updateStatus: async (id: string): Promise<Shelter> => {
    const response = await axios.patch(`${BASE_URL}/shelters/${id}/status`, {}, {
      withCredentials: true,
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string; shelter: Shelter }> => {
    const response = await axios.delete(`${BASE_URL}/shelters/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
