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
            // Guardar token en localStorage
            localStorage.setItem('access_token', response.data.accessToken);
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
            // Limpiar token del localStorage
            localStorage.removeItem('access_token');
            toast.success("¡Hasta luego!");
            return response.data;
        } catch (error) {
            // Limpiar token incluso si hay error
            localStorage.removeItem('access_token');
            toast.error("Error al cerrar sesión");
            throw error;
        }
    },

    googleAuth: () => {
        window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
    },

    // Función para obtener el token del localStorage
    getToken: () => {
        return localStorage.getItem('access_token');
    },

    // Función para verificar si hay token
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
}
