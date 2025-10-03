import axios from "axios";
import { getApiUrl } from "@/config/environment";

export const apiClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: false, // Ya no necesitamos cookies
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token del localStorage a todas las peticiones
apiClient.interceptors.request.use(
    (config) => {
        // Leer el token del localStorage
        const token = localStorage.getItem('access_token');
        
        if (token) {
            // Agregar el token al header Authorization
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🔑 Usando token de localStorage para autenticación");
        } else {
            console.log("🔑 No se encontró token en localStorage");
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas y errores de autenticación
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el token expiró o es inválido (401), limpiar localStorage y redirigir
        if (error.response?.status === 401) {
            console.log("❌ Error 401: Token inválido o expirado");
            
            // Limpiar el token del localStorage
            localStorage.removeItem('access_token');
            
            // Redirigir a la página de login
            window.location.href = '/auth';
        }
        
        return Promise.reject(error);
    }
);
