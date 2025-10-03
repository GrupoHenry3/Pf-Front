
import * as yup from "yup";

export interface RegisterFormValues{
  fullName: string;
  email: string;
  password: string;
  confirmedPassword?: string;
}
export interface LoginFormValues {
  email: string;
  password: string;
}

export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};


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
