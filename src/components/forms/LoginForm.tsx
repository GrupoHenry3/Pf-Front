"use client";

import { Lock, Mail, User } from "lucide-react";
import InputWithIcon from "./InputWithIcon";
import type { AuthFormData } from "../../interfaces/auth";

interface LoginFormProps {
  formData: Pick<AuthFormData, "email" | "password">;
  onChange: (field: keyof AuthFormData, value: string) => void;
}

export default function LoginForm({ formData, onChange }: LoginFormProps) {
  return (
    <div className="space-y-6">
      <InputWithIcon
        label="Correo o usuario"
        id="email"
        placeholder="tu@email.com / usuario"
        type="text"
        icon={User}
        value={formData.email}
        onChange={(value) => onChange("email", value)}
      />

      <InputWithIcon
        label="Contraseña"
        id="password"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.password}
        onChange={(value) => onChange("password", value)}
      />

      <div className="text-center">
        <button
          type="button"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}
