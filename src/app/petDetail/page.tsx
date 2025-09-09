"use client";

import { PetDetail } from "@/components/PetCatalog/PetDetail";
import type { Pet } from "@/interfaces/Pet";
import type { User } from "@/interfaces/User";

export default function PetDetailPage() {
  const mockPet: Pet = {
    id: 1,
    name: "Firulais",
    type: "dog",
    breed: "Labrador Retriever",
    age: 3,
    size: "medium",
    gender: "male",
    vaccinated: true,
    neutered: false,
    trained: true,
    goodWithKids: true,
    goodWithPets: true,
    location: "Bogotá, Colombia",
    dateAdded: new Date().toISOString(),
    description:
      "Firulais es un perro juguetón, muy cariñoso y lleno de energía. Le encanta salir a pasear, correr y recibir cariño. Ideal para una familia activa.",
    images: [
      "https://placedog.net/800/600?id=100",
      "https://placedog.net/800/600?id=101",
      "https://placedog.net/800/600?id=102",
    ],
    shelterName: "Refugio Huellitas",
  };

  const mockUser: User = {
    id: 1,
    name: "Eduin",
    role: "adopter", // puede ser "adopter" o "shelter"
  };

  return (
    <PetDetail
      pet={mockPet}
      user={mockUser}
      onBack={() => console.log("Volver al catálogo")}
      onStartChat={() => console.log("Iniciar chat con refugio")}
      onStartAdoption={(pet) => console.log("Solicitud de adopción:", pet)}
    />
  );
}
