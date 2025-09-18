// interfaces/auth.ts

export type UserRole = "adopter" | "shelter" | "admin";

export interface UserAdoption {
  id: string;

  role: "adopter" | "shelter" | "admin";
  name: string; // Nombre de usuario único
  email: string;
  password: string;
  confirmedPassword: boolean;
}

export interface UserRefugio {
  role: "adoptante" | "refugio";
  refugeName?: string;
  cuit?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

