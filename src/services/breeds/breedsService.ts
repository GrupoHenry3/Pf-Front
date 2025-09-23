import axios from "axios";
import { getApiUrl } from "@/config/environment";

// Interfaces para las razas
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
  /**
   * Crear una nueva raza
   * Endpoint: POST /breeds
   * Autenticación: No requiere (público)
   * Descripción: Permite agregar una nueva raza al sistema asociada a una especie
   * Requiere especificar la especie a la que pertenece la raza
   * Ejemplo: Raza "Golden Retriever" pertenece a la especie "Perro"
   */
  create: async (data: CreateBreedDTO): Promise<Breed> => {
    const response = await axios.post(`${BASE_URL}/breeds`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * Obtener todas las razas
   * Endpoint: GET /breeds
   * Autenticación: No requiere (público)
   * Descripción: Retorna una lista de todas las razas disponibles en el sistema
   * Útil para poblar dropdowns y formularios de selección de razas
   * Incluye información de la especie a la que pertenece cada raza
   */
  findAll: async (): Promise<Breed[]> => {
    const response = await axios.get<Breed[]>(`${BASE_URL}/breeds`);
    return response.data;
  },

  /**
   * Obtener una raza por ID
   * Endpoint: GET /breeds/:id
   * Autenticación: No requiere (público)
   * Descripción: Retorna los detalles completos de una raza específica
   * Incluye descripción, imagen y la especie asociada
   */
  findOne: async (id: string): Promise<Breed> => {
    const response = await axios.get(`${BASE_URL}/breeds/${id}`);
    return response.data;
  },

  /**
   * Actualizar una raza
   * Endpoint: PATCH /breeds/:id
   * Autenticación: No requiere (público)
   * Descripción: Permite modificar la información de una raza existente
   * Se pueden actualizar el nombre, descripción, imagen o cambiar la especie asociada
   */
  update: async (id: string, data: UpdateBreedDTO): Promise<Breed> => {
    const response = await axios.patch(`${BASE_URL}/breeds/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * Eliminar una raza
   * Endpoint: DELETE /breeds/:id
   * Autenticación: No requiere (público)
   * Descripción: Elimina permanentemente una raza del sistema
   * ⚠️ Esta acción es irreversible y puede afectar las mascotas asociadas a esta raza
   * Se recomienda verificar que no haya mascotas usando esta raza antes de eliminarla
   */
  remove: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${BASE_URL}/breeds/${id}`);
    return response.data;
  },
};
