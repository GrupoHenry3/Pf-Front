import { UserInterface } from "@/interfaces/User";
import { apiClient } from "../apiClient";

export interface GetUsersFilters {
  active?: boolean;
  admin?: boolean;
  type?: string;
  search?: string;
}

export const usersService = {
  list: async (filters: GetUsersFilters = {}): Promise<UserInterface[]> => {
    const params = new URLSearchParams();
    if (typeof filters.active === "boolean") params.set("active", String(filters.active));
    if (typeof filters.admin === "boolean") params.set("admin", String(filters.admin));
    if (filters.type) params.set("type", filters.type);
    if (filters.search) params.set("search", filters.search);

    const url = `/users${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await apiClient.get<UserInterface[]>(url);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get(`/users/me`);
    console.log(response.data);
    return response.data;
  },

  update: async (data: UserInterface): Promise<UserInterface> => {
    const response = await apiClient.patch(`/users`, data);
    return response.data;
  },

  remove: async (): Promise<{ id: string; isActive: boolean; createdAt: string; updatedAt: string }> => {
    const response = await apiClient.delete(`/users`);
    return response.data;
  },

  updateStatus: async (id: string): Promise<UserInterface> => {
    const response = await apiClient.patch(`/users/${id}/status`);
    return response.data;
  },
};

