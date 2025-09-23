import axios from "axios";
import { getApiUrl } from "@/config/environment";

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

const BASE_URL = getApiUrl();

export const usersService = {
  list: async (filters: GetUsersFilters = {}): Promise<UserSummary[]> => {
    const params = new URLSearchParams();
    if (typeof filters.active === "boolean") params.set("active", String(filters.active));
    if (typeof filters.admin === "boolean") params.set("admin", String(filters.admin));
    if (filters.type) params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);

    const url = `${BASE_URL}/users${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await axios.get<UserSummary[]>(url, {
      withCredentials: true,
    });
    return response.data;
  },


  getCurrentUser: async () => {
    const response = await axios.get(`${BASE_URL}/users/me`, {
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  },

  update: async (data: UpdateUserDTO): Promise<UserSummary> => {
    const response = await axios.patch(`${BASE_URL}/users`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  remove: async (): Promise<{ id: string; isActive: boolean; createdAt: string; updatedAt: string }> => {
    const response = await axios.delete(`${BASE_URL}/users`, {
      withCredentials: true,
    });
    return response.data;
  },

  updateStatus: async (id: string): Promise<UserSummary> => {
    const response = await axios.patch(`${BASE_URL}/users/${id}/status`, {}, {
      withCredentials: true,
    });
    return response.data;
  },
};


