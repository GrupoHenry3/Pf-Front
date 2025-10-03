import { apiClient } from "../apiClient";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmedPassword: string;
}



export const authService = {
    login: async (data: LoginData) => {
        const response = await apiClient.post("/auth/signin", data);
        return response.data; 
    },

    register: async (data: RegisterData) => {
        const response = await apiClient.post("/auth/signup", data);
        return response.data; 
    },

    logout: async () => {
        const response = await apiClient.post("/auth/signout");
        return response.data;
    },

    googleAuth: () => {
        window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
    }
}
