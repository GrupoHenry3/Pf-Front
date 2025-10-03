import axios from "axios";
import { getApiUrl } from "@/config/environment";

export const apiClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para manejar respuestas y errores de autenticación
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el token expiró o es inválido (401), redirigir a login
        if (error.response?.status === 401) {
            console.log("❌ Error 401: Token inválido o expirado");
            window.location.href = '/auth';
        }
        
        return Promise.reject(error);
    }
);
