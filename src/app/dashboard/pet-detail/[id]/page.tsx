"use client";
import * as React from 'react';
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import PATHROUTES from "@/components/utils/PathRoutes.util";
import { petsService } from "@/services/pets/petsService";
import { Pet } from "@/interfaces/Pet";

 function PetDetail({params}: {params: Promise<{id: string}>}) {

  const [isFavorite, setIsFavorite] = useState(false);
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {id} = React.use(params);
  const {user} = useUser();

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
   

  const getSizeLabel = (size: string) => {
    switch (size.toLowerCase()) {
      case "small":
        return "Pequeño";
      case "medium":
        return "Mediano";
      case "large":
        return "Grande";
      default:
        return size;
    }
  };

  const getTypeLabel = (speciesName: string | undefined) => {
    switch (speciesName?.toLowerCase()) {
      case "dog":
      case "perro":
        return "Perro";
      case "cat":
      case "gato":
        return "Gato";
      default:
        return speciesName;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Macho";
      case "female":
        return "Hembra";
      default:
        return gender;
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la mascota...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-gray-900 mb-4">Mascota no encontrada</h1>
          <p className="text-gray-600 mb-6">{error || "La mascota que buscas no existe o ha sido removida."}</p>
          <Button asChild>
            <Link href={PATHROUTES.CATALOG}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <Link href={"/dashboard/pet-catalog"}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al catálogo
            </Link>
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500 border-red-200" : ""}
            >
              <Heart
                className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
              />
              {isFavorite ? "Guardado" : "Guardar"}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Main Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="border-0 shadow-md mb-6">
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback
                    src={pet.avatarURL}
                    alt={pet.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className={pet.status === "adopted" ? "bg-red-500 text-white" : "bg-green-500 text-white"}>
                      {pet.status === "adopted" ? "Adoptado" : "Disponible para adopción"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pet Information */}
            <Card className="border-0 shadow-md mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl text-gray-900 mb-2">
                      {pet.name}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>{pet.breed.name}</span>
                      <span>•</span>
                      <span>{pet.age} años</span>
                      <span>•</span>
                      <span>{getSizeLabel(pet.size)}</span>
                      <span>•</span>
                      <span>{getGenderLabel(pet.gender)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getTypeLabel(pet.species?.name)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg text-gray-900 mb-3">
                      Sobre {pet.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {pet.breed.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg text-gray-900 mb-4">
                    Características
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Tamaño:</span>
                      <span className="text-gray-900">{getSizeLabel(pet.size)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Género:</span>
                      <span className="text-gray-900">{getGenderLabel(pet.gender)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Especie:</span>
                      <span className="text-gray-900">{getTypeLabel(pet.species?.name)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600">Raza:</span>
                      <span className="text-gray-900">{pet.breed.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

  
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Refugio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" alt={pet.shelter.name} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {pet.shelter.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-gray-900">{pet.shelter.name}</h4>
                    <p className="text-sm text-gray-500">Refugio verificado</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="text-sm text-gray-600">
                  <p className="mb-2">📍 {pet.shelter.address}, {pet.shelter.city}</p>
                  <p className="mb-2">📞 {pet.shelter.phoneNumber}</p>
                  {pet.shelter.website && <p className="mb-2">🌐 {pet.shelter.website}</p>}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                {pet.status === "adopted" ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      {pet.name} ya ha sido adoptado
                    </p>
                    <Button variant="outline" className="w-full" disabled>
                      <Heart className="w-4 h-4 mr-2" />
                      Adoptado
                    </Button>
                  </div>
                ) : user ? (
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center"
                    >
                      <Link
                        href={`${PATHROUTES.ADOPTION}/${pet.id}`}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        ¡Quiero adoptar a {pet.name}!
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Inicia sesión para adoptar a {pet.name}
                    </p>
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={() =>
                        alert("Inicia sesión para solicitar adopción")
                      }
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Características</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Especie:</span>
                  <span className="text-gray-900">
                    {getTypeLabel(pet.species?.name)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raza:</span>
                  <span className="text-gray-900">{pet.breed.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Edad:</span>
                  <span className="text-gray-900">{pet.age} años</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tamaño:</span>
                  <span className="text-gray-900">
                        {getSizeLabel(pet.size)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Género:</span>
                  <span className="text-gray-900">
                    {getGenderLabel(pet.gender)}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export default PetDetail;