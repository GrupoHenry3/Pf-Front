"use client";

import { Mail, Lock, UserCircle2 } from "lucide-react";
import InputWithIcon from "./InputWithIcon";

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  formData: RegisterFormData;
  onChange: (field: keyof RegisterFormData, value: string) => void;
}

export default function RegisterForm({ formData, onChange }: RegisterFormProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Nombre */}
      <InputWithIcon
        label="Nombre completo"
        id="fullName"
        placeholder="Juan Pérez"
        type="text"
        icon={UserCircle2}
        value={formData.fullName || ""}
        onChange={(value) => onChange("fullName", value)}
      />

      {/* Correo electrónico */}
      <InputWithIcon
        label="Correo electrónico"
        id="email"
        placeholder="usuario@email.com"
        type="email"
        icon={Mail}
        value={formData.email || ""}
        onChange={(value) => onChange("email", value)}
      />

      {/* Contraseña */}
      <InputWithIcon
        label="Contraseña"
        id="password"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.password || ""}
        onChange={(value) => onChange("password", value)}
      />

      {/* Confirmar contraseña */}
      <InputWithIcon
        label="Confirmar contraseña"
        id="confirmPassword"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.confirmPassword || ""}
        onChange={(value) => onChange("confirmPassword", value)}
      />
    </div>
  );
}
