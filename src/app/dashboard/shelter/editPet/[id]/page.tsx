"use client";

import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditPetPageProps {
  params: {
    id: string;
  };
}

export default function EditPetPage({ params }: EditPetPageProps) {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const router = useRouter();
  const { id } = params;

  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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
    <ProtectedRoute allowedUserTypes={["Shelter"]}>
      <div className="flex min-h-screen">
        <div className="flex-1 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Editar Mascota
              </h1>
              <p className="text-lg text-gray-600">
                Modifica la información de la mascota (ID: {id})
              </p>
            </div>

            {/* Formulario placeholder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Formulario de Editar Mascota
                </h3>
                <p className="text-gray-600 mb-6">
                  Aquí irá el formulario para editar la mascota con ID: {id}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Información básica (nombre, edad, género, tamaño)</p>
                  <p>• Especie y raza</p>
                  <p>• Descripción y características</p>
                  <p>• Fotos de la mascota</p>
                  <p>• Estado de salud (vacunado, esterilizado, etc.)</p>
                  <p>• Estado de adopción</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
