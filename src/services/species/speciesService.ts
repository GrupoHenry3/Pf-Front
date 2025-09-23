import axios from "axios";
import { getApiUrl } from "@/config/environment";

// Interfaces para las especies
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
  /**
   * Crear una nueva especie
   * Endpoint: POST /species
   * Autenticación: No requiere (público) - Los guards están comentados en el backend
   * Descripción: Permite agregar una nueva especie al sistema (ej: Perro, Gato, Conejo, etc.)
   * Nota: Aunque los guards están comentados, en producción debería requerir permisos de administrador
   */
  create: async (data: CreateSpeciesDTO): Promise<Species> => {
    const response = await axios.post(`${BASE_URL}/species`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * Obtener todas las especies
   * Endpoint: GET /species
   * Autenticación: No requiere (público) - Los guards están comentados en el backend
   * Descripción: Retorna una lista de todas las especies disponibles en el sistema
   * Útil para poblar dropdowns y formularios de selección
   */
  findAll: async (): Promise<Species[]> => {
    const response = await axios.get<Species[]>(`${BASE_URL}/species`);
    return response.data;
  },

  /**
   * Obtener una especie por ID
   * Endpoint: GET /species/:id
   * Autenticación: No requiere (público) - Los guards están comentados en el backend
   * Descripción: Retorna los detalles de una especie específica
   * Útil para obtener información detallada de una especie particular
   */
  findOne: async (id: string): Promise<Species> => {
    const response = await axios.get(`${BASE_URL}/species/${id}`);
    return response.data;
  },

  /**
   * Actualizar una especie
   * Endpoint: PATCH /species/:id
   * Autenticación: No requiere (público) - Los guards están comentados en el backend
   * Descripción: Permite modificar el nombre de una especie existente
   * Nota: Aunque los guards están comentados, en producción debería requerir permisos de administrador
   */
  update: async (id: string, data: UpdateSpeciesDTO): Promise<Species> => {
    const response = await axios.patch(`${BASE_URL}/species/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * Eliminar una especie
   * Endpoint: DELETE /species/:id
   * Autenticación: No requiere (público) - Los guards están comentados en el backend
   * Descripción: Elimina permanentemente una especie del sistema
   * ⚠️ Esta acción es irreversible y puede afectar las razas y mascotas asociadas
   * Nota: Aunque los guards están comentados, en producción debería requerir permisos de administrador
   */
  remove: async (id: string): Promise<{ message: string }> => {
    const response = await axios.delete(`${BASE_URL}/species/${id}`);
    return response.data;
  },
};
