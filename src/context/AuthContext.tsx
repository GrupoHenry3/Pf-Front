"use client";

import { createContext, useContext } from "react";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

import { authService } from "@/services/auth/authService";
import { UserInterface } from "@/interfaces/User";

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    confirmedPassword: string
  ) => Promise<UserInterface>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Helper centralizado y configurable
function getErrorMessage(error: unknown, fallback = "Ocurrió un error"): string {
  const ax = error as AxiosError<{ message?: string; error?: string }>;
  const status = ax?.response?.status;

  // 1) Priorizar mensajes del backend si existen
  const serverMsg = ax?.response?.data?.message ?? ax?.response?.data?.error;
  if (serverMsg) return serverMsg;

  // 2) Mapeos útiles por tipo de error
  if (ax?.code === "ERR_NETWORK" || ax?.message?.toLowerCase().includes("network")) {
    return "No hay conexión con el servidor. Verificá tu internet.";
  }
  if (status === 400) return "Solicitud inválida.";
  if (status === 401) return "Credenciales inválidas. Revisá email y contraseña.";
  if (status === 403) return "No tenés permisos para esta acción.";
  if (status === 404) return "Recurso no encontrado.";
  if (status && status >= 500) return "El servidor tuvo un problema. Intentalo más tarde.";

  // 3) Mensaje por defecto por acción
  return fallback;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const clearError = () => {
    // Si en el futuro guardás error en estado/contexto, limpiarlo acá
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login...");
      clearError();
      const loginResponse = await authService.login({ email, password });
      console.log("Login response:", loginResponse);
      console.log("Getting profile after login...");
      toast.success("Sesión iniciada ✅", { id: "login-success" });
    } catch (error: unknown) {
      console.error("Error during login:", error);
      toast.error(getErrorMessage(error, "Error al iniciar sesión"));
      throw error; // mantiene el flujo actual de manejo de errores
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
    confirmedPassword: string
  ): Promise<UserInterface> => {
    try {
      clearError();
      const newUser = await authService.register({
        fullName,
        email,
        password,
        confirmedPassword,
      });
      toast.success("Cuenta creada 🎉", { id: "register-success" });
      return newUser;
    } catch (error: unknown) {
      console.error("Error during registration:", error);
       toast.error(getErrorMessage(error, "Error al registrarse"));
      throw error;
    }
  };

  const logout = async () => {
    try {
      clearError();
      await authService.logout();
      toast.success("Sesión cerrada 👋", { id: "logout-success" });
    } catch (error: unknown) {
      console.error("Error during logout:", error);
      toast.error(getErrorMessage(error, "Error al cerrar sesión"));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
