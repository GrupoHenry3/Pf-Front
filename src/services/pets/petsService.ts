import axios from "axios";

// Interfaces para las mascotas
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

const BASE_URL = "http://localhost:5500/api";

export const petsService = {
  /**
   * Crear una nueva mascota
   * Endpoint: POST /pets
   * Autenticación: No requiere (público)
   * Descripción: Permite crear una nueva mascota en el sistema
   */
  create: async (data: CreatePetDTO): Promise<Pet> => {
    const response = await axios.post(`${BASE_URL}/pets`, data);
    return response.data;
  },

  /**
   * Obtener todas las mascotas activas (público)
   * Endpoint: GET /pets
   * Autenticación: No requiere (público)
   * Descripción: Retorna una lista paginada de mascotas activas disponibles para adopción
   * Incluye relaciones con shelter, breed y species
   */
  findAll: async (filters: PetFilters = {}): Promise<PetWithRelations[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `${BASE_URL}/pets${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<PetWithRelations[]>(url);
    return response.data;
  },

  /**
   * Obtener todas las mascotas (activas e inactivas) - Solo Administradores
   * Endpoint: GET /pets/all
   * Autenticación: Requiere JWT + permisos de administrador
   * Descripción: Retorna todas las mascotas del sistema, incluyendo las inactivas
   * Solo usuarios con privilegios de administrador pueden acceder
   */
  findAllWithInactive: async (filters: PetFilters = {}): Promise<PetWithRelations[]> => {
    const params = new URLSearchParams();
    if (filters.skip !== undefined) params.set("skip", filters.skip.toString());
    if (filters.take !== undefined) params.set("take", filters.take.toString());

    const url = `${BASE_URL}/pets/all${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<PetWithRelations[]>(url, {
      withCredentials: true, // Envía cookies para autenticación
    });
    return response.data;
  },

  /**
   * Obtener una mascota por ID
   * Endpoint: GET /pets/:id
   * Autenticación: No requiere (público)
   * Descripción: Retorna los detalles completos de una mascota específica
   * Incluye relaciones con shelter, breed y species
   */
  findOne: async (id: string): Promise<PetWithRelations> => {
    const response = await axios.get(`${BASE_URL}/pets/${id}`);
    return response.data;
  },

  /**
   * Actualizar una mascota - Solo Administradores
   * Endpoint: PATCH /pets/:id
   * Autenticación: Requiere JWT + permisos de administrador
   * Descripción: Permite actualizar la información de una mascota existente
   * Solo usuarios con privilegios de administrador pueden realizar esta acción
   */
  update: async (id: string, data: UpdatePetDTO): Promise<PetWithRelations> => {
    const response = await axios.patch(`${BASE_URL}/pets/${id}`, data, {
      withCredentials: true, // Envía cookies para autenticación
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * Desactivar una mascota (soft delete) - Solo Administradores
   * Endpoint: DELETE /pets/:id
   * Autenticación: Requiere JWT + permisos de administrador
   * Descripción: Marca una mascota como inactiva en lugar de eliminarla físicamente
   * Esto permite mantener el historial y reactivar la mascota si es necesario
   * Solo usuarios con privilegios de administrador pueden realizar esta acción
   */
  remove: async (id: string): Promise<{ message: string; pet: PetWithRelations }> => {
    const response = await axios.delete(`${BASE_URL}/pets/${id}`, {
      withCredentials: true, // Envía cookies para autenticación
    });
    return response.data;
  },
};
