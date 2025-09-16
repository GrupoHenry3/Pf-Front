"use client";

import { Lock, User } from "lucide-react";
import InputWithIcon from "./InputWithIcon";
import { LoginFormValues } from "@/validators/loginSchema";


interface LoginFormProps {
  formData: LoginFormValues;
  onLoginInputsChange: (field: keyof LoginFormValues, value: string) => void;
}

export default function LoginForm({ formData, onLoginInputsChange }: LoginFormProps) {
  return (
    <div className="space-y-6">
      <InputWithIcon
        label="Correo o usuario"
        id="email"
        placeholder="tu@email.com / usuario"
        type="text"
        icon={User}
        value={formData.email}
        onChange={(value) => onLoginInputsChange("email", value)}
      />

      <InputWithIcon
        label="Contraseña"
        id="password"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.password}
        onChange={(value) => onLoginInputsChange("password", value)}
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
