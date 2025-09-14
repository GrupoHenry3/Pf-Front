"use client";
import { PetCatalog } from "@/components/petCatalog/PetCatalog";
import type { Pet } from "@/interfaces/Pet";

export default function PetCatalogPage() {
  const handleViewPet = (pet: Pet) => {
    console.log("Ver detalles de:", pet);
    // aquí en el futuro podemos redirigir a /pet/[id]
  };

  return <PetCatalog onViewPet={handleViewPet} user={null} />;
}
