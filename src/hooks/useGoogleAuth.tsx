import { User } from '@/interfaces/User';
import { useEffect, useState } from 'react';


// Declarar tipos para Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleConfig) => void;
          renderButton: (parent: HTMLElement, config: ButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleConfig {
  client_id: string;
  callback: (response: CredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface ButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
}

interface CredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Google Client ID (en producción esto debería venir de variables de entorno)
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
    '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com'; // Placeholder

  useEffect(() => {
    // Cargar el script de Google Identity Services
    const loadGoogleScript = () => {
      if (window.google) {
        setIsInitialized(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsInitialized(true);
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const parseJwtPayload = (token: string): GoogleUserInfo => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      throw new Error('Invalid token format');
    }
  };

  const signInWithGoogle = (
    userRole: UserRole,
    onSuccess: (user: User) => void,
    onError: (error: string) => void
  ) => {
    if (!isInitialized || !window.google) {
      onError('Google Authentication no está disponible');
      return;
    }

    setIsLoading(true);

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: CredentialResponse) => {
          try {
            const userInfo = parseJwtPayload(response.credential);
            
            const userData: User = {
              id: `google_${userInfo.sub}`,
              name: userInfo.name,
              email: userInfo.email,
              role: userRole || 'adopter',
              avatar: userInfo.picture,
              verified: userInfo.email_verified,
              joinDate: new Date().toISOString(),
              phone: '',
              location: ''
            };

            setIsLoading(false);
            onSuccess(userData);
          } catch (error) {
            console.error('Error processing Google response:', error);
            setIsLoading(false);
            onError('Error al procesar la respuesta de Google');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Mostrar el prompt de autenticación
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error initializing Google Auth:', error);
      setIsLoading(false);
      onError('Error al inicializar la autenticación de Google');
    }
  };

  const renderGoogleButton = (
    element: HTMLElement,
    userRole: UserRole,
    onSuccess: (user: User) => void,
    onError: (error: string) => void
  ) => {
    if (!isInitialized || !window.google) {
      onError('Google Authentication no está disponible');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: CredentialResponse) => {
          try {
            const userInfo = parseJwtPayload(response.credential);
            
            const userData: User = {
              id: `google_${userInfo.sub}`,
              name: userInfo.name,
              email: userInfo.email,
              role: userRole || 'adopter',
              avatar: userInfo.picture,
              verified: userInfo.email_verified,
              joinDate: new Date().toISOString(),
              phone: '',
              location: ''
            };

            onSuccess(userData);
          } catch (error) {
            console.error('Error processing Google response:', error);
            onError('Error al procesar la respuesta de Google');
          }
        },
      });

      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
      });
    } catch (error) {
      console.error('Error rendering Google button:', error);
      onError('Error al mostrar el botón de Google');
    }
  };

  return {
    isLoading,
    isInitialized,
    signInWithGoogle,
    renderGoogleButton,
  };
}