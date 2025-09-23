// Configuración de entorno
// Este archivo maneja las variables de entorno de manera segura

interface EnvironmentConfig {
  API_URL: string;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

export const ENV: EnvironmentConfig = {
  // URL del backend - se puede configurar via variable de entorno o usar default
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api',
  
  // Entorno actual
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Helpers para verificar el entorno
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Función para obtener la URL del API según el entorno
export const getApiUrl = (): string => {
  // En desarrollo, usar localhost
  if (ENV.IS_DEVELOPMENT) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';
  }
  
  // En producción, usar la URL de Render o la variable de entorno
  return process.env.NEXT_PUBLIC_API_URL || 'https://tu-backend-en-render.onrender.com/api';
};
