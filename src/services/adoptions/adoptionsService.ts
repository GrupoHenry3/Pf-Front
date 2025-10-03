import { apiClient } from "../apiClient";

// Interfaces que coinciden con el backend
export interface AdoptionDTO {
  dni: string;
  birthdate: string;
  mainReason: string;
  expectatives: string;
  previousPetExp: 'None' | 'Basic' | 'Moderate' | 'Experienced';
  houseType: 'House' | 'Apartment' | 'Farm';
  houseOwnership: 'Owned' | 'Rented';
  houseOuterSpace: 'None' | 'Small' | 'Medium' | 'Large';
  workingHours: string;
  dailyRoutine: string;
  houseMembers: string;
  livingSpace: string;
  houseKidsAges?: string;
  houseCurrentPets?: string;
  dailyExcercise?: string;
  travelFrequency?: string;
  shelterID: string;
  petID: string;
  petHistory?: string;
  additionalInfo?: string;

}

export interface UpdateAdoptionDTO {
  status?: 'Pending' | 'Approved' | 'Rejected' | 'Withdrawn';
  rejectionReason?: string;
}

export interface AdoptionResponse {
  statusCode: number;
  data: {
    id: string;
    dni: string;
    birthdate: string;
    mainReason: string;
    expectatives: string;
    previousPetExp: string;
    houseType: string;
    houseOwnership: string;
    houseOuterSpace: string;
    workingHours: string;
    dailyRoutine: string;
    houseMembers: string;
    livingSpace: string;
    houseKidsAges?: string;
    houseCurrentPets?: string;
    dailyExcercise?: string;
    travelFrequency?: string;
    petHistory?: string;
    additionalInfo?: string;
    status: string;
    rejectionReason?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    userID: string;
    shelterID: string;
    petID: string;
  };
}

export interface AdoptionWithRelations {
  id: string;
  dni: string;
  birthdate: string;
  mainReason: string;
  expectatives: string;
  previousPetExp: string;
  houseType: string;
  houseOwnership: string;
  houseOuterSpace: string;
  workingHours: string;
  dailyRoutine: string;
  houseMembers: string;
  livingSpace: string;
  houseKidsAges?: string | null;
  houseCurrentPets?: string | null;
  dailyExcercise?: string | null;
  travelFrequency?: string | null;
  petHistory?: string | null;
  additionalInfo?: string | null;
  status: string;
  userID: string;
  shelterID: string;
  petID: string;
  rejectionReason?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null; // 👈 importante
    avatarURL: string;
  };
  pet: {
    id: string;
    name: string;
    age: number;
    gender: string;
    size: string;
    avatarURL: string;
    breed: {
      name: string;
    };
    species: {
      name: string;
    };
  };
  shelter: {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
  };
}

export interface AdminAdoptions {
  id: string;
  dni: string;
  birthdate: string;
  mainReason: string;
  expectatives: string;
  previousPetExp: string;
  houseType: string;
  houseOwnership: string;
  houseOuterSpace: string;
  workingHours: string;
  dailyRoutine: string;
  houseMembers: string;
  livingSpace: string;
  houseKidsAges?: string | null;
  houseCurrentPets?: string | null;
  dailyExcercise?: string | null;
  travelFrequency?: string | null;
  petHistory?: string | null;
  additionalInfo?: string | null;
  status: string;
  userID: string;
  shelterID: string;
  petID: string;
  rejectionReason?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    avatarURL: string;
  };

  pet: {
    id: string;
    name: string;
    age: number;
    gender: string;
    size: string;
    avatarURL: string;
    breed: {
      name: string;
    };
    species: {
      name: string;
    };
  };

  shelter: {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
  };
}


export interface AdoptionsByShelterResponse {
  statusCode: number;
  data: AdoptionWithRelations[];
}

export const adoptionsService = {
  create: async (data: AdoptionDTO): Promise<AdoptionResponse> => {
    const response = await apiClient.post<AdoptionResponse>('/adoptions', data);
    return response.data;
  },

  findAll: async (): Promise<AdminAdoptions[]> => {
    const response = await apiClient.get('/adoptions');
    return response.data;
  },

  // Obtener adopción por ID
  findOne: async (id: string): Promise<AdoptionResponse> => {
    const response = await apiClient.get<AdoptionResponse>(`/adoptions/${id}`);
    return response.data;
  },

  // Actualizar estado de adopción
  updateStatus: async (id: string, data: UpdateAdoptionDTO): Promise<AdoptionResponse> => {
    const response = await apiClient.patch<AdoptionResponse>(`/adoptions/${id}/status`, data);
    return response.data;
  },

  // Eliminar adopción (soft delete)
  delete: async (id: string): Promise<{ statusCode: number; message: string }> => {
    const response = await apiClient.delete<{ statusCode: number; message: string }>(`/adoptions/${id}`);
    return response.data;
  },

  // Obtener adopciones por shelter ID
  findByShelterId: async (shelterId: string): Promise<AdoptionsByShelterResponse> => {
    const response = await apiClient.get<AdoptionsByShelterResponse>(`/adoptions/shelter/${shelterId}`);
    return response.data;
  }
};
