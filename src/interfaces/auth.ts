// interfaces/auth.ts

export type UserRole = "adopter" | "shelter" | "admin";



export interface AuthFormData {
  role: "adoptante" | "refugio";
  name?: string;         // solo refugio
  fullName?: string;     // solo adoptante
  refugeName?: string;   // solo refugio
  username: string;
  dni?: string;          // adoptante
  cuit?: string;         // refugio
  email: string;
  password: string;
  confirmPassword: string;
}
