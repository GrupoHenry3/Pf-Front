import { Shelter } from "@/interfaces/Shelter";
import axios from "axios";
import { getApiUrl } from "@/config/environment";

// Interfaz para la creación de shelters con campos simplificados
interface CreateShelterData {
  name: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
}

// Interfaz para filtros de búsqueda de shelters
interface GetSheltersFilters {
  country?: string;
  state?: string;
  city?: string;
}

// Interfaz para actualizar shelter
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
  /**
   * Crear un nuevo refugio
   * Endpoint: POST /shelters
   * Autenticación: Requiere JWT token (Bearer)
   * Descripción: Permite registrar un nuevo refugio en el sistema
   * El usuario autenticado se convertirá en el responsable del refugio
   * Campos requeridos: name, address, phoneNumber, city, state, country
   */
  create: async (data: CreateShelterData): Promise<Shelter> => {
    const response = await axios.post(`${BASE_URL}/shelters`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Obtener todos los refugios
   * Endpoint: GET /shelters
   * Autenticación: No requiere (público)
   * Descripción: Retorna una lista de refugios con filtros opcionales
   * Filtros disponibles: country, state, city
   */
  findAll: async (filters: GetSheltersFilters = {}): Promise<Shelter[]> => {
    const params = new URLSearchParams();
    if (filters.country) params.set("country", filters.country);
    if (filters.state) params.set("state", filters.state);
    if (filters.city) params.set("city", filters.city);
    
    const url = `${BASE_URL}/shelters${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<Shelter[]>(url);
    return response.data;
  },

  /**
   * Obtener un refugio por ID
   * Endpoint: GET /shelters/:id
   * Autenticación: No requiere (público)
   * Descripción: Retorna los detalles completos de un refugio específico
   */
  findOne: async (id: string): Promise<Shelter> => {
    const response = await axios.get(`${BASE_URL}/shelters/${id}`);
    return response.data;
  },

  /**
   * Actualizar un refugio
   * Endpoint: PATCH /shelters/:id
   * Autenticación: Requiere JWT token (Bearer)
   * Descripción: Actualiza la información de un refugio existente
   */
  update: async (id: string, data: UpdateShelterData): Promise<Shelter> => {
    const response = await axios.patch(`${BASE_URL}/shelters/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Cambiar estado de verificación del refugio
   * Endpoint: PATCH /shelters/:id/status
   * Autenticación: Requiere JWT token (Bearer)
   * Descripción: Cambia el estado de verificación del refugio
   */
  updateStatus: async (id: string): Promise<Shelter> => {
    const response = await axios.patch(`${BASE_URL}/shelters/${id}/status`, {}, {
      withCredentials: true,
    });
    return response.data;
  },

  /**
   * Eliminar un refugio
   * Endpoint: DELETE /shelters/:id
   * Autenticación: Requiere JWT token (Bearer)
   * Descripción: Elimina un refugio del sistema
   */
  delete: async (id: string): Promise<{ message: string; shelter: Shelter }> => {
    const response = await axios.delete(`${BASE_URL}/shelters/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },
};
