// Configuración de la API
export const API_CONFIG = {
  // URL base del backend
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api',
  
  // Timeout para las peticiones
  TIMEOUT: 10000,
  
  // Configuración de axios por defecto
  DEFAULT_CONFIG: {
    timeout: 10000,
    withCredentials: true,
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  // Remover slash inicial si existe
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
};
