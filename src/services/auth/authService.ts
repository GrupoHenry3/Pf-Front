import axios from "axios";
import { getApiUrl } from "@/config/environment";

 interface LoginData {
    email: string,
    password: string
}

interface RegisterData {
    fullName: string,
    email: string,
    password: string,
    confirmedPassword: string
}

const apiClient = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authService = {
    /**
     * Iniciar sesión de usuario
     * Endpoint: POST /auth/signin
     * Autenticación: No requiere (público)
     * Descripción: Autentica al usuario con email y contraseña
     * El servidor establece una cookie 'access_token' con el JWT
     * La cookie es httpOnly, segura en producción y tiene duración de 1 hora
     * Retorna información del usuario autenticado
     */
    login: async (data: LoginData) => {
        const response = await apiClient.post("/auth/signin", data);
        return response.data; 
    },

    /**
     * Registrar nuevo usuario
     * Endpoint: POST /auth/signup
     * Autenticación: No requiere (público)
     * Descripción: Crea una nueva cuenta de usuario en el sistema
     * Valida que el email no esté en uso y que las contraseñas coincidan
     * Retorna información del usuario creado
     */
    register: async (data: RegisterData) => {
        const response = await apiClient.post("/auth/signup", data);
        return response.data; 
    },

    /**
     * Cerrar sesión de usuario
     * Endpoint: POST /auth/signout
     * Autenticación: No requiere (público)
     * Descripción: Cierra la sesión del usuario actual
     * Limpia la cookie 'access_token' del navegador
     * Retorna mensaje de confirmación de logout exitoso
     */
    logout: async () => {
        const response = await apiClient.post("/auth/signout");
        return response.data;
    },

    /**
     * Iniciar autenticación con Google
     * Endpoint: GET /auth/google
     * Autenticación: No requiere (público)
     * Descripción: Redirige al usuario a Google OAuth para autenticación
     * Después de la autenticación exitosa, Google redirige a /auth/google/callback
     * El callback establece la cookie de sesión y redirige al frontend
     */
    googleAuth: () => {
        window.location.href = `${apiClient.defaults.baseURL}/auth/google`;
    }
}