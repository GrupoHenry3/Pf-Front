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
  list: async (filters: GetUsersFilters = {}): Promise<UserSummary[]> => {
    const params = new URLSearchParams();
    if (typeof filters.active === "boolean") params.set("active", String(filters.active));
    if (typeof filters.admin === "boolean") params.set("admin", String(filters.admin));
    if (filters.type) params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);

    const url = `${BASE_URL}/users${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<UserSummary[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<UserSummary & { adoptions: any; favoritePets: any }> => {
    const response = await axios.get(`${BASE_URL}/users/${id}`);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      withCredentials: true, // Para enviar cookies
    });
    return response.data;
  },

  update: async (id: string, data: UpdateUserDTO): Promise<UserSummary> => {
    const response = await axios.patch(`${BASE_URL}/users/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  remove: async (id: string): Promise<{ id: string; isActive: boolean; createdAt: string; updatedAt: string }> => {
    const response = await axios.delete(`${BASE_URL}/users/${id}`);
    return response.data;
  },
};


