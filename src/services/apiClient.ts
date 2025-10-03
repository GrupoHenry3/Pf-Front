import axios from "axios";
import { getApiUrl } from "@/config/environment";

export const apiClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar el token de la cookie a todas las peticiones
apiClient.interceptors.request.use(
    (config) => {
        // Leer la cookie accesible (sin httpOnly)
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];
            
        if (token) {
            // Agregar el token al header Authorization
            config.headers.Authorization = `Bearer ${token}`;
            console.log("🍪 Usando token de cookie accesible para autenticación");
        } else {
            console.log("🍪 No se encontró token de cookie accesible");
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
        // Si el token expiró o es inválido (401), limpiar cookies y redirigir
        if (error.response?.status === 401) {
            console.log("❌ Error 401: Token inválido o expirado");
            
            // Limpiar la cookie accesible
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none';
            
            // Redirigir a la página de login
            window.location.href = '/auth';
        }
        
        return Promise.reject(error);
    }
);
