"use client";

import { Users, Heart, MessageCircle, MapPin, Calendar, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import { ShelterSidebar } from "@/components/sidebar/ShelterSidebar";

interface ShelterDashboardProps {
  onAddPet: () => void;
  onManageApplications: () => void;
  onViewMessages: () => void;
}


function ShelterDashboard({
  onAddPet,
  onManageApplications,
}: ShelterDashboardProps) {

  const { 
    user, 
    isProfileLoaded, 
    isUserLoading, 
    isInitialized, 
  } = useUser();


  const stats = {
    totalPets: 34,
    adopted: 127,
    pending: 8,
    applications: 15,
  };

  // const myPets = [
  //   {
  //     id: "1",
  //     name: "Buddy",
  //     type: "dog",
  //     breed: "Labrador",
  //     age: 3,
  //     image:
  //       "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
  //     status: "available",
  //     applications: 3,
  //     dateAdded: "2024-02-15",
  //   },
  //   {
  //     id: "2",
  //     name: "Mittens",
  //     type: "cat",
  //     breed: "Persian",
  //     age: 2,
  //     image:
  //       "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
  //     status: "pending",
  //     applications: 1,
  //     dateAdded: "2024-03-01",
  //   },
  //   {
  //     id: "3",
  //     name: "Charlie",
  //     type: "dog",
  //     breed: "Beagle",
  //     age: 1,
  //     image:
  //       "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
  //     status: "available",
  //     applications: 5,
  //     dateAdded: "2024-03-10",
  //   },
  // ];

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "available":
  //       return "bg-green-100 text-green-800";
  //     case "pending":
  //       return "bg-orange-100 text-orange-800";
  //     case "adopted":
  //       return "bg-blue-100 text-blue-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  // const getStatusLabel = (status: string) => {
  //   switch (status) {
  //     case "available":
  //       return "Disponible";
  //     case "pending":
  //       return "En proceso";
  //     case "adopted":
  //       return "Adoptado";
  //     default:
  //       return status;
  //   }
  // };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "reviewing":
        return "bg-orange-100 text-orange-800";
      case "interview":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusLabel = (status: string) => {
    switch (status) {
      case "new":
        return "Nueva";
      case "reviewing":
        return "Revisando";
      case "interview":
        return "Entrevista";
      case "approved":
        return "Aprobada";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!isInitialized && "Inicializando..."}
            {isInitialized && isUserLoading && "Cargando perfil..."}
            {isInitialized && !isUserLoading && !isProfileLoaded && "Verificando autenticación..."}
          </p>
        </div>
      </div>
    );
  }
  
  if (isInitialized && isProfileLoaded && !user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-white shadow-sm">
        <ShelterSidebar user={user} embedded={true} />
      </div>
      {/* Contenido principal */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
            onClick={onAddPet}
            variant="default"
            size="lg"
            className="mt-4 sm:mt-0 bg-primary hover:bg-primary/70"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Mascota
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mascotas Activas</p>
                  <p className="text-2xl text-gray-900">{stats.totalPets}</p>
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
                  <p className="text-sm text-gray-500">Adopciones Exitosas</p>
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
                  <p className="text-sm text-gray-500">Solicitudes Pendientes</p>
                  <p className="text-2xl text-gray-900">{stats.applications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aplicaciones y mascotas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Applications */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>Solicitudes Recientes</span>
                </span>
                <Button variant="outline" size="sm" onClick={onManageApplications}>
                  Ver todas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
       
              </div>
            </CardContent>
          </Card>

          {/* My Pets */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mis Mascotas</span>
                <Button variant="outline" size="sm">
                  Ver todas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="relative mb-3">
                      <ImageWithFallback
                        src={pet.image}
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
                      <h4 className="text-lg text-gray-900">{pet.name}</h4>
                      <Badge className={getStatusColor(pet.status)}>
                        {getStatusLabel(pet.status)}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {pet.breed} • {pet.age} años
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {pet.applications} solicitudes
                      </span>
                      <span className="text-gray-500">
                        Agregado el{" "}
                        {new Date(pet.dateAdded).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );

}

export default ShelterDashboard;
