"use client";

import {
  Users,
  Heart,
  MessageCircle,
  Calendar,
  Plus,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { usePet } from "@/context/PetContext";
import { AdoptionWithRelations } from "@/services/adoptions/adoptionsService";
import { useAdoption } from "@/context/AdoptionContext";
import { Pet } from "@/interfaces/Pet";
import { Badge } from "@/components/ui/badge";

interface ShelterDashboardProps {
  onManageApplications: () => void;
  onViewMessages: () => void;
}

function ShelterDashboard({ onManageApplications }: ShelterDashboardProps) {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();

  const { pets, isPetLoading, latestPets } = usePet();
  const { latestAdoptions, shelterAdoptions } = useAdoption();
  const router = useRouter();
  const stats = {
    totalPets: pets.length,
    adopted: pets.filter((pet) => pet.status === "adopted").length,
    pending: pets.filter((pet) => pet.status === "pending").length,
    applications: shelterAdoptions.length, // TODO: Implementar cuando tengas el contexto de aplicaciones
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded || isPetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!isInitialized && "Inicializando..."}
            {isInitialized && isUserLoading && "Cargando perfil..."}
            {isInitialized &&
              !isUserLoading &&
              !isProfileLoaded &&
              "Verificando autenticación..."}
          </p>
        </div>
      </div>
    );
  }

  if (isInitialized && isProfileLoaded && !user) {
    return null;
  }

  return (
    <ProtectedRoute allowedUserTypes={["Shelter"]}>
      <div className="flex min-h-screen">
        <div className="flex-1 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl text-gray-900 mb-2">
                  Panel de {user?.shelter?.name}
                </h1>
                <p className="text-lg text-gray-600">
                  Gestiona tus mascotas y solicitudes de adopción
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/addPet")}
                variant="default"
                size="lg"
                className="mt-4 sm:mt-0 bg-primary hover:bg-primary/70"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Mascota
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mascotas Activas</p>
                      <p className="text-2xl text-gray-900">
                        {stats.totalPets}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Adopciones Exitosas
                      </p>
                      <p className="text-2xl text-gray-900">{stats.adopted}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">En Proceso</p>
                      <p className="text-2xl text-gray-900">{stats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Solicitudes Pendientes
                      </p>
                      <p className="text-2xl text-gray-900">
                        {stats.applications}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <span>Solicitudes Recientes</span>
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onManageApplications}
                    >
                      Ver todas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {latestAdoptions.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                          No hay solicitudes de adopción recientes
                        </p>
                      </div>
                    ) : (
                      <div>
                        {latestAdoptions.map(
                          (adoption: AdoptionWithRelations) => (
                              
                              <div
                                key={adoption.id}
                                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                                onClick={() => router.push(`/dashboard/adoption/${adoption.id}`)}
                              >
                                <ImageWithFallback
                                  src={adoption.pet.avatarURL}
                                  alt={adoption.pet.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-lg text-gray-900">
                                      {adoption.pet.name}
                                    </h4>
                                    <Badge
                                      variant={
                                        adoption.status === "approved"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        adoption.status === "approved"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-orange-100 text-orange-800"
                                      }
                                    >
                                      {adoption.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    adopter: {adoption.user.fullName}
                                  </p>
                                  <small className="text-sm text-gray-600">
                                    aplicado el{" "}
                                    {new Date(
                                      adoption.createdAt
                                    ).toLocaleDateString()}
                                  </small>
                                </div>
                              </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Mis Mascotas</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/dashboard/shelter/pets")}
                    >
                      Ver todas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pets.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        No tienes mascotas registradas
                      </p>
                      <Button
                        onClick={() => router.push("/dashboard/addPet")}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar primera mascota
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {latestPets.map((pet: Pet) => (
                        <div
                          key={pet.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="relative mb-3">
                            <ImageWithFallback
                              src={
                                pet.breed.avatarURL || "/placeholder-pet.jpg"
                              }
                              alt={pet.name}
                              className="w-full h-40 rounded-lg object-cover"
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-lg text-gray-900">
                              {pet.name}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                pet.status === "adopted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {pet.status ? "Adoptado" : "Disponible"}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {pet.breed.name} • {pet.age} años • {pet.size}
                          </p>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {pet.species.name}
                            </span>
                            <span className="text-gray-500">
                              Agregado el{" "}
                              {new Date(pet.dateAdded).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default ShelterDashboard;
