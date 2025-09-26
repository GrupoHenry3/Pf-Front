"use client";

import { ShelterPets } from "./ShelterPets";
import { usePet } from "@/context/PetContext";
import { useUser } from "@/context/UserContext";

// Ejemplo de cómo usar el componente ShelterPets en tu página de shelter
export function ShelterPetsExample() {
  const { pets, isPetLoading } = usePet();
  const { user } = useUser();

  // Filtrar mascotas del refugio actual (asumiendo que tienes el shelterId del usuario)
  const shelterPets = pets.filter(pet => 
    pet.shelter?.id === user?.shelter?.id
  );

  const handleAddPet = () => {
    // Lógica para agregar nueva mascota
    console.log("Agregar nueva mascota");
  };

  const handleEditPet = (pet: any) => {
    // Lógica para editar mascota
    console.log("Editar mascota:", pet);
  };

  return (
    <div className="p-6">
      <ShelterPets
        pets={shelterPets}
        isPetLoading={isPetLoading}
        shelterId={user?.shelter?.id}
        showAddButton={true}
        onAddPet={handleAddPet}
        onEditPet={handleEditPet}
      />
    </div>
  );
}
