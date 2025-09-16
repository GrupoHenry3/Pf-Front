"use client";

import { useState } from "react";
import { Users, Heart, MessageCircle, MapPin, Edit, Calendar, Plus } from "lucide-react";
import { User } from "@/interfaces/User";

import { Sidebar } from "@/components/sidebar/Sidebar"; // ✅ Sidebar general
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { Badge } from "@/components/ui/badge";

interface ShelterDashboardProps {
  user: User;
  onAddPet: () => void;
  onManageApplications: () => void;
  onViewMessages: () => void;
}

const shelterExample = {
  name: "Shelter Example",
  location: "Madrid, España",
  email: "contact@shelterexample.com",
  phone: "912345678",
  website: "www.shelterexample.com",
  description:
    "Shelter Example es una organización sin fines de lucro que ayuda a rescatar y adoptar mascotas en necesitad de ayuda.",
  image:
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
};

function ShelterDashboard({
  user,
  onAddPet,
  onManageApplications,
  onViewMessages,
}: ShelterDashboardProps) {
  const stats = {
    totalPets: 34,
    adopted: 127,
    pending: 8,
    applications: 15,
  };

  const myPets = [
    {
      id: "1",
      name: "Buddy",
      type: "dog",
      breed: "Labrador",
      age: 3,
      image:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      status: "available",
      applications: 3,
      dateAdded: "2024-02-15",
    },
    {
      id: "2",
      name: "Mittens",
      type: "cat",
      breed: "Persian",
      age: 2,
      image:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
      status: "pending",
      applications: 1,
      dateAdded: "2024-03-01",
    },
    {
      id: "3",
      name: "Charlie",
      type: "dog",
      breed: "Beagle",
      age: 1,
      image:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
      status: "available",
      applications: 5,
      dateAdded: "2024-03-10",
    },
  ];

  const recentApplications = [
    {
      id: "1",
      petName: "Charlie",
      petImage:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
      applicantName: "María González",
      applicantLocation: "Madrid, España",
      applicationDate: "2024-03-18",
      status: "new",
      score: 92,
    },
    {
      id: "2",
      petName: "Buddy",
      petImage:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      applicantName: "Carlos Ruiz",
      applicantLocation: "Barcelona, España",
      applicationDate: "2024-03-17",
      status: "reviewing",
      score: 87,
    },
    {
      id: "3",
      petName: "Buddy",
      petImage:
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      applicantName: "Ana López",
      applicantLocation: "Valencia, España",
      applicationDate: "2024-03-16",
      status: "interview",
      score: 95,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "adopted":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "pending":
        return "En proceso";
      case "adopted":
        return "Adoptado";
      default:
        return status;
    }
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ✅ Sidebar general */}
      <Sidebar user={user} />

      {/* Contenido principal */}
      <main className="flex-1 lg:ml-64 mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">
              Panel de {shelterExample.name}
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
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <ImageWithFallback
                      src={app.petImage}
                      alt={app.petName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg text-gray-900">
                          {app.applicantName}
                        </h4>
                        <Badge className={getApplicationStatusColor(app.status)}>
                          {getApplicationStatusLabel(app.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Interesado en{" "}
                        <span className="font-medium">{app.petName}</span>
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {app.applicantLocation}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Compatibilidad:
                          </span>
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-600"
                          >
                            {app.score}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Ver perfil
                      </Button>
                      <Button size="sm" className="bg-primary hover:bg-green-600">
                        Contactar
                      </Button>
                    </div>
                  </div>
                ))}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default ShelterDashboard;
