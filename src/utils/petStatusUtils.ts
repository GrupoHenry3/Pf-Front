import { Pet } from '@/interfaces/Pet';

export type PetStatus = 'available' | 'pending' | 'adopted' | 'inactive';

/**
 * Calcula el status de una mascota basado en los campos isAdopted e isActive
 */
export const getPetStatus = (pet: Pet): PetStatus => {
  // Si la mascota no está activa, está inactiva
  if (pet.isActive === false) {
    return 'inactive';
  }
  
  // Si la mascota está adoptada, está adoptada
  if (pet.isAdopted === true) {
    return 'adopted';
  }
  
  // Si está activa y no adoptada, está disponible
  return 'available';
};

/**
 * Obtiene el label en español para el status
 */
export const getPetStatusLabel = (status: PetStatus): string => {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'adopted':
      return 'Adoptado';
    case 'pending':
      return 'Pendiente';
    case 'inactive':
      return 'Inactivo';
    default:
      return 'Desconocido';
  }
};

/**
 * Obtiene la variante del badge para el status
 */
export const getPetStatusVariant = (status: PetStatus): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case 'available':
      return 'default';
    case 'adopted':
      return 'secondary';
    case 'pending':
      return 'outline';
    case 'inactive':
      return 'destructive';
    default:
      return 'outline';
  }
};

/**
 * Obtiene las clases CSS para el badge del status
 */
export const getPetStatusBadgeClasses = (status: PetStatus): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500 text-white';
    case 'adopted':
      return 'bg-red-500 text-white';
    case 'pending':
      return 'bg-orange-100 text-orange-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
