import { Credential } from "./Credential";

// types/user.ts
export interface User {
  id: string;

  role: "adopter" | "shelter" | "admin";
  name: string; // Nombre completo o nombre del refugio               // Nombre de usuario único
  email: string;
  password: string; // Hashed password
  confirmed_password: boolean; // Email confirmado
}
