"use client";

import { Mail, Lock, UserCircle2 } from "lucide-react";
import InputWithIcon from "./InputWithIcon";
import { RegisterFormValues } from "@/validators/loginSchema";


interface RegisterFormProps {
  formData: RegisterFormValues;
  onRegisterChange: (field: keyof RegisterFormValues, value: string) => void;
}

export default function RegisterForm({ formData, onRegisterChange }: RegisterFormProps) {
  return (
    <div className="space-y-6 w-full">
      <InputWithIcon
        label="Nombre completo"
        id="fullName"
        placeholder="Juan Pérez"
        type="text"
        icon={UserCircle2}
        value={formData.fullName}
        onChange={(value) => onRegisterChange("fullName", value)}
      />

      <InputWithIcon
        label="Correo electrónico"
        id="email"
        placeholder="usuario@email.com"
        type="email"
        icon={Mail}
        value={formData.email}
        onChange={(value) => onRegisterChange("email", value)}
      />

      <InputWithIcon
        label="Contraseña"
        id="password"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.password}
        onChange={(value) => onRegisterChange("password", value)}
      />

      <InputWithIcon
        label="Confirmar contraseña"
        id="confirmPassword"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.confirmedPassword || ""}
        onChange={(value) => onRegisterChange("confirmedPassword", value)}
      />
    </div>
  );
}
