import { USER_TYPES } from "@/constants/userTypes";
import { NextRouter } from "next/router";

/**
 * Obtiene la URL de redirección basada en el tipo de usuario
 * @param userType - Tipo de usuario ('User' o 'Shelter')
 * @returns URL de redirección apropiada
 */
export const getRedirectUrlByUserType = (userType: string): string => {
  switch (userType) {
    case USER_TYPES.SHELTER:
      return "/dashboard/shelter";
    case USER_TYPES.USER:
    default:
      return "/dashboard/adopter";
  }
};

/**
 * Redirige al usuario según su tipo después de la autenticación
 * @param userType - Tipo de usuario
 * @param router - Instancia de Next.js router
 */
export const redirectAfterAuth = (userType: string, router: NextRouter) => {
  const redirectUrl = getRedirectUrlByUserType(userType);
  router.push(redirectUrl);
};
