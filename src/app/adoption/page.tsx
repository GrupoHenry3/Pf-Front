"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdoptionApplication from "@/components/adoptionApplication/AdoptionApplication";
import { Sidebar } from "@/components/sidebar/Sidebar";
import type { User } from "@/interfaces/User";
import type { Pet } from "@/interfaces/Pet";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock de usuario
const mockUser: User = {
  id: "u123",
  name: "Juan Pérez",
  email: "juan@example.com", // si tu interfaz lo tiene
  role: "adopter", // o "shelter" o "admin", según necesites
  password: "123456", // solo mock, no real
  confirmed_password: true, // email confirmado
};

// Mock de mascota
const mockPet: Pet = {
  id: "p456",
  name: "Firulais",
  breed: "Labrador",
  age: 3,
  gender: "male",
  location: "Refugio Huellas",
  shelterName: "Refugio Huellas",
  shelterId: "s789",
  images: ["https://placedog.net/800/600?id=100"],
  dni: "12345",
  type: "dog",
  size: "medium",
  description: "Perro amigable y juguetón",
  status: "available",
  vaccinated: true,
  neutered: true,
  trained: false,
  goodWithKids: true,
  goodWithPets: true,
  dateAdded: "2025-09-11",
  // requirements: ["Patio amplio", "Familia con experiencia"],
  // personality: "Amigable",
  // health: "Excelente"
};

export default function AdopcionPage() {
  // Estado para la vista actual del sidebar
  const [currentView, setCurrentView] = useState("catalog");
  // Función para navegación
  const handleNavigate = (view) => setCurrentView(view);
  // Función para logout
  const handleLogout = () => router.push("/login");
  const router = useRouter();

  const handleBack = () => router.push("/"); // Volver al home
  const handleSubmit = (applicationData: any) => {
    console.log("📩 Solicitud enviada:", applicationData);
    router.push("/gracias"); // Redirige a página de confirmación
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
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header superior */}
            <div className="flex items-center justify-between mb-6">
              <div className="mb-6">

                <Button
                  onClick={() => router.back()}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 flex items-left"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </div>

              {/* <button
                onClick={() => router.back()} 
                className="text-gray-600 hover:text-gray-900 flex items-left"
              >
                <ArrowLeft className="w-4 h-4 mr-2"/>
                Volver
              </button> */}

              <span className="flex items-center gap-2 text-orange-600 font-medium text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21C12 21 7 16.5 4 12.5C2.5 10.5 2.5 7.5 4.5 5.5C6.5 3.5 9.5 3.5 11.5 5.5C13.5 3.5 16.5 3.5 18.5 5.5C20.5 7.5 20.5 10.5 19 12.5C16 16.5 12 21 12 21Z"
                  />
                </svg>
                Solicitud para {mockPet.name}
              </span>
            </div>
            {/* Tarjeta de mascota estilo imagen */}
            <div
              className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 mb-8"
              style={{ minHeight: "90px" }}
            >
              <img
                src={mockPet.images[0]}
                alt={mockPet.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {mockPet.name}
                  </h2>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  {mockPet.breed} • {mockPet.age} años • {mockPet.location}
                </p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  {mockPet.shelterName}
                </span>
              </div>
            </div>
            {/* Formulario de adopción */}
            <AdoptionApplication />
          </div>
        </div>
      </div>
    </main>
  );
}
