"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "../ui/utils"; // si no tienes `cn`, puedes hacer `${className ?? ""}` directamente

export default function InputWithIcon({
  label,
  id,
  placeholder,
  value,
  onChange,
  type = "text",
  icon: Icon,
  required = true,
  className, // 👈 añadida
}: {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon: React.ElementType;
  required?: boolean;
  className?: string; // 👈 añadida
}) {
  return (
    <div className={cn("space-y-2 text--500", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative"><Icon className="absolute left-3 top-3 w-4 h-4 text--400" /><Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 rounded-full bg-gray-100 border-0 focus:ring-2 focus:ring-green-500"
          required={required}
        />
      </div>
    </div>
  );
}
