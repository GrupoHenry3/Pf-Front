"use client";

import { useState, useEffect } from "react";
import AdoptionApplication from "@/components/adoptionApplication/AdoptionApplication";
import PATHROUTES from "@/components/utils/PathRoutes.util";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PetWithRelations } from "@/interfaces/Pet";
import { petsService } from "@/services/pets/petsService";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdopcionPage({params}: {params: {id: string}}) {
  const {id} = params;
  const [pet, setPet] = useState<PetWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Cargar datos de la mascota
  useEffect(() => {
    const loadPet = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const petData = await petsService.findOne(id);
        setPet(petData);
      } catch (error) {
        console.error("Error al cargar mascota:", error);
        setError("No se pudo cargar la información de la mascota");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPet();
    }
  }, [id]);

  // Estados de carga y error
  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la mascota...</p>
        </div>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-4">Mascota no encontrada</h1>
          <p className="text-gray-600 mb-6">{error || "La mascota que buscas no existe o ha sido removida."}</p>
          <Button onClick={() => router.push(PATHROUTES.CATALOG)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al catálogo
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex h-full">

        {/* Contenido principal */}
        <div className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Header superior */}
            <div className="flex items-center justify-between mb-6">
              <button
                className="flex items-center gap-2 text-gray-900 font-semibold hover:underline bg-transparent shadow-none px-0 py-0 rounded-none"
                onClick={() => {
                  router.push(PATHROUTES.CATALOG);
                }}
              >
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={2} stroke='currentColor' className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
                </svg>
                Volver
              </button>
              <span className="flex items-center gap-2 text-orange-600 font-medium text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 7 16.5 4 12.5C2.5 10.5 2.5 7.5 4.5 5.5C6.5 3.5 9.5 3.5 11.5 5.5C13.5 3.5 16.5 3.5 18.5 5.5C20.5 7.5 20.5 10.5 19 12.5C16 16.5 12 21 12 21Z" />
                </svg>
                Solicitud para {pet.name}
              </span>
            </div>
            {/* Tarjeta de mascota estilo imagen */}
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 mb-8" style={{ minHeight: '90px' }}>
              <Image 
                src={pet.breed.avatarURL || "/placeholder-pet.jpg"} 
                alt={pet.name} 
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg" 
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{pet.name}</h2>
                </div>
                <p className="text-gray-600 text-sm mt-1">{pet.breed.name} • {pet.age} años • {pet.shelter.city}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                  pet.isAdopted 
                    ? "bg-red-100 text-red-700" 
                    : "bg-green-100 text-green-700"
                }`}>
                  {pet.isAdopted ? "Adoptado" : "Disponible"}
                </span>
              </div>
            </div>
            {/* Formulario de adopción */}
            <AdoptionApplication pet={pet}/>
          </div>
        </div>
      </div>
    </main>
  );
}
