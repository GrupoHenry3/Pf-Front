interface EnvironmentConfig {
  API_URL: string;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

export const ENV: EnvironmentConfig = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

export const getApiUrl = (): string => {
  if (ENV.IS_DEVELOPMENT) {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500/api';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'https://petadoption-back-dev.onrender.com'
};
