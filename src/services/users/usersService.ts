import axios from "axios";

export interface GetUsersFilters {
  active?: boolean;
  admin?: boolean;
  type?: string;
  search?: string;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  phoneNumber: string | null;
  avatarURL: string | null;
  userType: string | null;
  siteAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  confirmedPassword: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  country?: string;
  city?: string;
  address?: string;
  phoneNumber?: string;
  avatarURL?: string;
  userType?: string;
  siteAdmin?: boolean;
  isActive?: boolean;
}

const BASE_URL = "http://localhost:5500/api";

export const usersService = {
  /**
   * Listar usuarios con filtros - Solo Administradores
   * Endpoint: GET /users
   * Autenticación: Requiere JWT + permisos de administrador
   * Descripción: Retorna una lista de usuarios con filtros opcionales
   * Solo usuarios con privilegios de administrador pueden acceder
   * Filtros disponibles: tipo de usuario, estado activo, privilegios de admin, búsqueda por texto
   */
  list: async (filters: GetUsersFilters = {}): Promise<UserSummary[]> => {
    const params = new URLSearchParams();
    if (typeof filters.active === "boolean") params.set("active", String(filters.active));
    if (typeof filters.admin === "boolean") params.set("admin", String(filters.admin));
    if (filters.type) params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);

    const url = `${BASE_URL}/users${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<UserSummary[]>(url, {
      withCredentials: true, // Envía cookies para autenticación
    });
    return response.data;
  },

  /**
   * Obtener usuario por ID
   * Endpoint: GET /users/:id
   * Autenticación: Requiere JWT (cualquier usuario autenticado)
   * Descripción: Retorna los detalles completos de un usuario específico
   * Incluye información de adopciones y mascotas favoritas
   */
  // getById: async (id: string): Promise<UserSummary & { adoptions: any; favoritePets: any }> => {
  //   const response = await axios.get(`${BASE_URL}/users/${id}`, {
  //     withCredentials: true, // Envía cookies para autenticación
  //   });
  //   return response.data;
  // },

  /**
   * Obtener usuario actual
   * Endpoint: GET /users/me
   * Autenticación: Requiere JWT (cualquier usuario autenticado)
   * Descripción: Retorna la información del usuario actualmente autenticado
   * Utiliza el token JWT para identificar al usuario
   * Útil para obtener datos del perfil del usuario logueado
   */
  getCurrentUser: async () => {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      withCredentials: true, // Para enviar cookies
    });
    console.log(response.data);
    return response.data;
  },

  /**
   * Actualizar usuario actual - Solo Administradores
   * Endpoint: PATCH /users
   * Autenticación: Requiere JWT + permisos de administrador
   * Descripción: Permite actualizar la información del usuario actualmente autenticado
   * Solo usuarios con privilegios de administrador pueden realizar esta acción
   * El ID del usuario se obtiene del token JWT
   */
  update: async (data: UpdateUserDTO): Promise<UserSummary> => {
    const response = await axios.patch(`${BASE_URL}/users`, data, {
      withCredentials: true, // Envía cookies para autenticación
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  /**
   * Eliminar usuario actual
   * Endpoint: DELETE /users
   * Autenticación: Requiere JWT (cualquier usuario autenticado)
   * Descripción: Permite al usuario actual eliminar su propia cuenta
   * El ID del usuario se obtiene del token JWT
   * ⚠️ Esta acción es irreversible
   */
  remove: async (): Promise<{ id: string; isActive: boolean; createdAt: string; updatedAt: string }> => {
    const response = await axios.delete(`${BASE_URL}/users`, {
      withCredentials: true, // Envía cookies para autenticación
    });
    return response.data;
  },

  /**
   * Cambiar estado de usuario - Solo Administradores
   * Endpoint: PATCH /users/:id/status
   * Autenticación: Requiere JWT + permisos de administrador
   * Descripción: Permite activar/desactivar un usuario específico
   * Solo usuarios con privilegios de administrador pueden realizar esta acción
   * Útil para suspender cuentas temporalmente
   */
  updateStatus: async (id: string): Promise<UserSummary> => {
    const response = await axios.patch(`${BASE_URL}/users/${id}/status`, {}, {
      withCredentials: true, // Envía cookies para autenticación
    });
    return response.data;
  },
};


