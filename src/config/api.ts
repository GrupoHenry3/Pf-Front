export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api',
  TIMEOUT: 10000,
  DEFAULT_CONFIG: {
    timeout: 10000,
    withCredentials: true,
  }
};

export const buildApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
};
