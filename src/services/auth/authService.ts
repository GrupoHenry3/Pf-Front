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
            toast.success("¡Hasta luego!");
            return response.data;
        } catch (error) {
            toast.error("Error al cerrar sesión");
            throw error;
        }
    },

    googleAuth: () => {
        window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
    },

    handleGoogleCallback: async () => {
        try {
            const response = await apiClient.get("/auth/google/callback");
            
            if (response.data.statusCode === 200) {
                toast.success("¡Autenticación con Google exitosa!");
                
                // Guardar el token en localStorage para uso posterior
                if (response.data.accessToken) {
                    localStorage.setItem('access_token', response.data.accessToken);
                }
                
                // Redirigir a la URL especificada
                if (response.data.redirectUrl) {
                    window.location.href = response.data.redirectUrl;
                }
                
                return response.data;
            } else {
                throw new Error(response.data.message || 'Error en la autenticación');
            }
        } catch (error: unknown) {
            toast.error("Error en la autenticación con Google");
            
            // Si hay una URL de redirección de error, redirigir a ella
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { redirectUrl?: string } } };
                if (axiosError.response?.data?.redirectUrl) {
                    window.location.href = axiosError.response.data.redirectUrl;
                } else {
                    window.location.href = "/auth?error=oauth_failed";
                }
            } else {
                // Redirección por defecto en caso de error
                window.location.href = "/auth?error=oauth_failed";
            }
            
            throw error;
        }
    }
}
