"use client";

import {
  Mail,
  Lock,
  IdCard,
  Building2,
  UserCircle2,
} from "lucide-react";
import InputWithIcon from "./InputWithIcon";
import type { AuthFormData, UserRole } from "../../interfaces/auth";

interface RegisterFormProps {
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  formData: AuthFormData;
  onChange: (field: keyof AuthFormData, value: string) => void;
}

export default function RegisterForm({
  userRole,
  onRoleChange,
  formData,
  onChange,
}: RegisterFormProps) {
  return (
    <div className="space-y-6 w-full">
      {/* Selector de rol */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onRoleChange("adoptante")}
          className={`p-3 rounded-lg border text-sm font-medium ${
            userRole === "adoptante"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          Soy Adoptante
        </button>
        <button
          type="button"
          onClick={() => onRoleChange("refugio")}
          className={`p-3 rounded-lg border text-sm font-medium ${
            userRole === "refugio"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 bg-white text-gray-600"
          }`}
        >
          Refugio
        </button>
      </div>

      {/* Campos diferentes según el rol */}
      {userRole === "adoptante" ? (
        <>
          <InputWithIcon
            label="Nombre completo"
            id="fullName"
            placeholder="Juan Pérez"
            type="text"
            icon={UserCircle2}
            value={formData.fullName || ""}
            onChange={(value) => onChange("fullName", value)}
          />
        </>
      ) : (
        <>
          <InputWithIcon
            label="Nombre del refugio"
            id="refugeName"
            placeholder="Refugio Esperanza"
            type="text"
            icon={Building2}
            value={formData.refugeName || ""}
            onChange={(value) => onChange("refugeName", value)}
          />

          <InputWithIcon
            label="CUIT / NIT (opcional)"
            id="cuit"
            placeholder="30-12345678-9"
            type="text"
            icon={IdCard}
            value={formData.cuit || ""}
            onChange={(value) => onChange("cuit", value)}
          />
        </>
      )}

      {/* Campos comunes */}
      <InputWithIcon
        label="Correo electrónico"
        id="email"
        placeholder="usuario@email.com"
        type="email"
        icon={Mail}
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

      <InputWithIcon
        label="Confirmar contraseña"
        id="confirmPassword"
        placeholder="••••••••"
        type="password"
        icon={Lock}
        value={formData.confirmPassword}
        onChange={(value) => onChange("confirmPassword", value)}
      />
    </div>
  );
}
