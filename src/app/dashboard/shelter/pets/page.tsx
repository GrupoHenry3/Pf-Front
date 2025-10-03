"use client";

import { useUser } from "@/context/UserContext";
import { usePet } from "@/context/PetContext";
import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";
import { useRouter } from "next/navigation";
import { ShelterPets } from "@/components/shelter/ShelterPets";
import { Pet } from "@/interfaces/Pet";

export default function ShelterPetsPage() {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const { shelterPets, isPetLoading } = usePet();
  const router = useRouter();

  const handleEditPet = (pet: Pet) => {
    router.push(`/dashboard/shelter/editPet/${pet.id}`);
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded || isPetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  if (!user?.shelter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h2>
          <p className="text-gray-600">Solo los refugios pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <div className="flex-1 bg-gray-50">
          <div className="mx-auto px-4 w-full py-8">
            <ShelterPets
              pets={shelterPets}
              isPetLoading={isPetLoading}
              shelterId={user.shelter.id}
              showAddButton={true}
              onEditPet={handleEditPet}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}