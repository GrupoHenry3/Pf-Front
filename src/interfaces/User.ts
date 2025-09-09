import { Credential } from "./Credential";

// types/user.ts
export interface User {
  id: string;

  // Datos comunes
  name: string;                     // Nombre completo o nombre del refugio
  username: string;               // Nombre de usuario único
  email: string;
  role: "adopter" | "shelter" | "admin";
  password: string;
  verified: boolean;
  joinDate: string;

  // Perfil opcional
  avatar?: string;
  phone?: string;
  location?: string;

  // Solo para adoptante
  fullName?: string;
  dni?: string;

  // Solo para refugio
  organizationName?: string;      // nombre del refugio
  organizationType?: string;      // ONG, Fundación, etc.
  cuit?: string;

  // Otros
  credentials?: Credential[];
}
