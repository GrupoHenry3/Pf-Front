"use client";

import AdoptionApplication from "@/components/adoptionApplication/AdoptionApplication";
import { PETS } from "@/data/pets";
import PATHROUTES from "@/components/utils/PathRoutes.util";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdopcionPage({params}: {params: {id: string}}) {
  const {id} = params;
  const pet = PETS.find((pet) => pet.id === id);
  const router = useRouter();
  
  // const handleSubmit = () => {
  //   console.log("📩 Solicitud enviada:", applicationData);
  //   router.push("/gracias"); // Redirige a página de confirmación
  // };

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
                Solicitud para {pet?.name}
              </span>
            </div>
            {/* Tarjeta de mascota estilo imagen */}
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-4 mb-8" style={{ minHeight: '90px' }}>
              {
                pet?.images?.map((image:string) => (
                  <Image key={image} src={image} alt={pet?.name} className="w-16 h-16 object-cover rounded-lg" />
                ))
              }
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{pet?.name}</h2>
                </div>
                <p className="text-gray-600 text-sm mt-1">{pet?.breed} • {pet?.age} años • {pet?.location}</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">{pet?.shelterName}</span>
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
