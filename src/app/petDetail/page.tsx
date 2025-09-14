"use client";

import { PetDetail } from "@/components/PetDetail/PetDetail";
import {Sidebar } from "@/components/sidebar/Sidebar";
import { useState } from "react";
import type { Pet } from "@/interfaces/Pet";
import type { User } from "@/interfaces/User";

export default function PetDetailPage() {
  const [currentView, setCurrentView] = useState("catalog");
  const handleNavigate = (view: string) => setCurrentView(view);
  const handleLogout = () => {};

  // 🚀 Simulación: mascota de ejemplo
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
    <main className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar a la izquierda */}
        <Sidebar
          user={mockUser}
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        {/* Contenido principal */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <PetDetail
              pet={mockPet}
              user={mockUser}
              onBack={() => console.log("Volver al catálogo")}
              onStartChat={() => console.log("Iniciar chat con refugio")}
              onStartAdoption={(pet) =>
                console.log("Solicitud de adopción:", pet)
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
