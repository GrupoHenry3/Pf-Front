import axios from "axios";

// Interfaz para la creación de shelters con campos simplificados
interface CreateShelterData {
  name: string;
  address: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
}

const BASE_URL = "http://localhost:5500/api";

export const sheltersService = {
  /**
   * Crear un nuevo refugio
   * Endpoint: POST /shelters
   * Autenticación: Requiere JWT token (Bearer)
   * Descripción: Permite registrar un nuevo refugio en el sistema
   * El usuario autenticado se convertirá en el responsable del refugio
   * Campos requeridos: name, address, phoneNumber, city, state, country
   */
  create: async (data: CreateShelterData) => {
    const response = await axios.post(`${BASE_URL}/shelters`, data, {
      withCredentials: true,
    });
    return response.data;
  },
};
//   /**
//    * Actualizar un refugio
//    * Endpoint: PATCH /shelters/:id
//    * Autenticación: No requiere (público)
//    * Descripción: Permite actualizar la información de un refugio existente
//    * Solo se pueden actualizar los campos proporcionados en el DTO
//    */
//   update: async (id: string, data: UpdateShelterDTO): Promise<Shelter> => {
//     const response = await axios.patch(`${BASE_URL}/shelters/${id}`, data, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return response.data;
//   },

//   /**
//    * Cambiar el estado de un refugio
//    * Endpoint: PATCH /shelters/:id/status
//    * Autenticación: No requiere (público)
//    * Descripción: Alterna el estado activo/inactivo de un refugio
//    * Útil para deshabilitar temporalmente un refugio sin eliminarlo
//    */
//   updateStatus: async (id: string): Promise<Shelter> => {
//     const response = await axios.patch(`${BASE_URL}/shelters/${id}/status`);
//     return response.data;
//   },

//   /**
//    * Eliminar un refugio
//    * Endpoint: DELETE /shelters/:id
//    * Autenticación: No requiere (público)
//    * Descripción: Elimina permanentemente un refugio del sistema
//    * ⚠️ Esta acción es irreversible y puede afectar las mascotas asociadas
//    */
//   delete: async (id: string): Promise<{ message: string }> => {
//     const response = await axios.delete(`${BASE_URL}/shelters/${id}`);
//     return response.data;
//   },

//   /**
//    * Obtener todos los refugios con filtros opcionales
//    * Endpoint: GET /shelters
//    * Autenticación: No requiere (público)
//    * Descripción: Retorna una lista de refugios con filtros opcionales por ubicación
//    * Útil para buscar refugios en una región específica
//    */
//   findAll: async (filters: GetSheltersFilters = {}): Promise<Shelter[]> => {
//     const params = new URLSearchParams();
//     if (filters.country) params.set("country", filters.country);
//     if (filters.state) params.set("state", filters.state);
//     if (filters.city) params.set("city", filters.city);

//     const url = `${BASE_URL}/shelters${params.toString() ? `?${params.toString()}` : ""}`;
//     const response = await axios.get<Shelter[]>(url);
//     return response.data;
//   },

//   /**
//    * Obtener un refugio por ID
//    * Endpoint: GET /shelters/:id
//    * Autenticación: No requiere (público)
//    * Descripción: Retorna los detalles completos de un refugio específico
//    * Incluye toda la información de contacto y ubicación del refugio
//    */
//   findOne: async (id: string): Promise<Shelter> => {
//     const response = await axios.get(`${BASE_URL}/shelters/${id}`);
//     return response.data;
//   },
// };
