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
        // Solo intentar leer la cookie si es accesible (Google OAuth)
        // Las cookies httpOnly se envían automáticamente con withCredentials: true
        try {
            const googleToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];
            
            if (googleToken) {
                // Agregar el token al header Authorization (solo para Google OAuth)
                config.headers.Authorization = `Bearer ${googleToken}`;
                console.log("🍪 Usando token de cookie (Google OAuth) para autenticación");
            } else {
                // No hay cookie accesible, confiar en cookies httpOnly (login normal)
                console.log("🍪 Usando cookies httpOnly (login normal) para autenticación");
            }
        } catch {
            // Si no se puede acceder a document.cookie, confiar en cookies httpOnly
            console.log("🍪 Usando cookies httpOnly (login normal) para autenticación");
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
            
            // Limpiar la cookie accesible (Google OAuth) si existe
            try {
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none';
            } catch (e) {
                // Si no se puede limpiar, no es problema (cookie httpOnly se limpia en el backend)
            }
            
            // Redirigir a la página de login
            window.location.href = '/auth';
        }
        
        return Promise.reject(error);
    }
);