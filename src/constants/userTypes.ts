/**
 * Constantes para tipos de usuario
 * Basado en el enum UserType del esquema de Prisma
 */
export const USER_TYPES = {
  USER: 'User',      // Adoptante - persona que quiere adoptar mascotas
  SHELTER: 'Shelter' // Refugio - organización que tiene mascotas para adoptar
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

/**
 * Verifica si un usuario es adoptante
 */
export const isAdopter = (userType: string): boolean => {
  return userType === USER_TYPES.USER;
};

/**
 * Verifica si un usuario es refugio
 */
export const isShelter = (userType: string): boolean => {
  return userType === USER_TYPES.SHELTER;
};

/**
 * Obtiene el nombre legible del tipo de usuario
 */
export const getUserTypeLabel = (userType: string): string => {
  switch (userType) {
    case USER_TYPES.USER:
      return 'Adoptante';
    case USER_TYPES.SHELTER:
      return 'Refugio';
    default:
      return 'Usuario';
  }
};

