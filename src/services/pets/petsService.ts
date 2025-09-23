import axios from "axios";
import { getApiUrl } from "@/config/environment";

export interface Pet {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  adoptionFee: number;
  isAdopted: boolean;
  isActive: boolean;
  shelterID: string;
  breedID: string;
  speciesID: string;
  adoptionID?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetWithRelations extends Pet {
  shelter: {
    id: string;
    name: string;
    country: string;
    state: string;
    city: string;
    address: string;
    phoneNumber: string;
    website?: string;
    description?: string;
  };
  breed: {
    id: string;
    name: string;
    description: string;
    avatarURL: string;
    speciesID: string;
  };
  species: {
    id: string;
    name: string;
  };
}

export interface CreatePetDTO {
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  size: 'Small' | 'Medium' | 'Large';
  adoptionFee: number;
  isAdopted?: boolean;
  isActive?: boolean;
  shelterID: string;
  breedID: string;
  speciesID: string;
  adoptionID?: string;
}

export interface UpdatePetDTO {
  name?: string;
  age?: number;
  gender?: 'Male' | 'Female';
  size?: 'Small' | 'Medium' | 'Large';
  adoptionFee?: number;
  isAdopted?: boolean;
  isActive?: boolean;
  shelterID?: string;
  breedID?: string;
  speciesID?: string;
  adoptionID?: string;
}

export interface PetFilters {
  skip?: number;
  take?: number;
}

const BASE_URL = getApiUrl();

export const petsService = {
  create: async (data: CreatePetDTO): Promise<Pet> => {
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

  findAllWithInactive: async (filters: PetFilters = {}): Promise<PetWithRelations[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `${BASE_URL}/pets/all${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<PetWithRelations[]>(url, {
      withCredentials: true,
    });
    return response.data;
  },

  findOne: async (id: string): Promise<PetWithRelations> => {
    const response = await axios.get(`${BASE_URL}/pets/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdatePetDTO): Promise<PetWithRelations> => {
    const response = await axios.patch(`${BASE_URL}/pets/${id}`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  remove: async (id: string): Promise<{ message: string; pet: PetWithRelations }> => {
    const response = await axios.delete(`${BASE_URL}/pets/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
