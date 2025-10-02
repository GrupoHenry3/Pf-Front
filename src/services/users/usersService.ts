import { UpdateUser, UserInterface } from "@/interfaces/User";
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
    return response.data;
  },

  update: async (data: UpdateUser): Promise<UserInterface> => {
    // Filtrar solo los campos permitidos por el backend
    const allowedFields: (keyof UpdateUser)[] = [
      'fullName',
      'email', 
      'country',
      'city',
      'address',
      'phoneNumber',
      'avatarURL'
    ];
    
    const filteredData = Object.keys(data)
      .filter(key => allowedFields.includes(key as keyof UpdateUser))
      .reduce((obj, key) => {
        obj[key as keyof UpdateUser] = data[key as keyof UpdateUser];
        return obj;
      }, {} as UpdateUser);
    
    const response = await apiClient.patch(`/users`, filteredData);
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

