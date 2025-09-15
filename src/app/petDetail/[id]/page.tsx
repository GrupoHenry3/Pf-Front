"use client";

import { PetDetail } from "@/components/PetDetail/PetDetail";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useState } from "react";
import { useParams } from "next/navigation";
import type { Pet } from "@/interfaces/Pet";
import type { User } from "@/interfaces/User";
import { PETS } from "@/data/pets"; // 👉 importa el mock con todas las mascotas

export default function PetDetailPage() {
  const params = useParams();
  const petId = Number(params?.id); // id dinámico desde la URL
  const [currentView, setCurrentView] = useState("catalog");

  const handleNavigate = (view: string) => setCurrentView(view);
  const handleLogout = () => {};

  // 👉 Buscar la mascota en el mock usando el id
  const mockPet: Pet | undefined = PETS.find((pet) => pet.id === petId);

  const mockUser: User = {
    id: 1,
    name: "Eduin",
    role: "adopter",
  };

  if (!mockPet) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-700 text-lg">
          Mascota no encontrada. Verifica el ID en la URL.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar /}
        <Sidebar
          user={mockUser}
          currentView={currentView}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        {/ Contenido principal */}
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <PetDetail
              pet={mockPet}
              user={mockUser}
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