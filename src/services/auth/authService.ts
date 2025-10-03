import { apiClient } from "../apiClient";
import toast from "react-hot-toast";

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
        try {
            const response = await apiClient.post("/auth/signin", data);
            toast.success("¡Bienvenido!");
            return response.data;
        } catch (error) {
            toast.error("Credenciales incorrectas");
            throw error;
        }
    },

    register: async (data: RegisterData) => {
        try {
            const response = await apiClient.post("/auth/signup", data);
            toast.success("¡Cuenta creada exitosamente!");
            return response.data;
        } catch (error) {
            toast.error("Error al crear la cuenta");
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await apiClient.post("/auth/signout");
            // El backend ya limpia la cookie httpOnly automáticamente
            // Solo necesitamos limpiar la cookie del frontend (Google OAuth)
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none';
            toast.success("¡Hasta luego!");
            return response.data;
        } catch (error) {
            // Limpiar la cookie del frontend incluso si hay error
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none';
            toast.error("Error al cerrar sesión");
            throw error;
        }
    },

    googleAuth: () => {
        window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
    },


}
