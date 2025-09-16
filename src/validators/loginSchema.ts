// VALORES DE LOS INPUT
// VALIDACIONES
// INTERFACES

import * as yup from "yup";

export interface RegisterFormValues{
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}
// definición de la interfaz
export interface LoginFormValues {
  email: string;
  password: string;
}

// Valores iniciales del formulario
export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};


// Esquema de validación
export const loginValidationSchema = yup.object({
    email: yup
        .string()
        .email("Debe ser un correo electrónico válido")
        .required("El correo electrónico es obligatorio"),
    password: yup
        .string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),      
}
);