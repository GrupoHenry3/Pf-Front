"use client";

import * as React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Check,
  X,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ImageWithFallback } from "../utils/ImageWithFallback";
import type { User } from "../../interfaces/User";
import type { Pet } from "../../interfaces/Pet";
import PATHROUTES from "../utils/PathRoutes.util";
import router from "next/router";
import Link from "next/link";

interface PetDetailProps {
  pet: Pet;
  onBack: () => void;
  user: User | null;
  onStartChat: () => void;
  onStartAdoption: (pet: Pet) => void;
}

export function PetDetail({
  pet,
  onBack,
  user,
  onStartChat,
  onStartAdoption,
}: PetDetailProps) {
  if (!pet) {
    return <div>No se encontró información de la mascota.</div>;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const characteristics = [
    { label: "Vacunado", value: pet.vaccinated, icon: Check },
    { label: "Esterilizado", value: pet.neutered, icon: Check },
    { label: "Entrenado", value: pet.trained, icon: Check },
    { label: "Bueno con niños", value: pet.goodWithKids, icon: Check },
    { label: "Bueno con otras mascotas", value: pet.goodWithPets, icon: Check },
  ];

  const getSizeLabel = (size: string) => {
    switch (size) {
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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dog":
        return "Perro";
      case "cat":
        return "Gato";
      default:
        return type;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Macho";
      case "female":
        return "Hembra";
      default:
        return gender;
    }
  };

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
            <Link href={PATHROUTES.CATALOG}>
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
                    src={pet.images[currentImageIndex]}
                    alt={pet.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white">
                      Disponible para adopción
                    </Badge>
                  </div>

                  {/* Image navigation dots */}
                  {pet.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {pet.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
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
                      <span>{pet.breed}</span>
                      <span>•</span>
                      <span>{pet.age} años</span>
                      <span>•</span>
                      <span>{getSizeLabel(pet.size)}</span>
                      <span>•</span>
                      <span>{getGenderLabel(pet.gender)}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getTypeLabel(pet.type)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pet.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Disponible desde{" "}
                    {new Date(pet.dateAdded).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg text-gray-900 mb-3">
                    Sobre {pet.name}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {pet.description}
                  </p>
                </div>

                {/* Characteristics */}
                <div>
                  <h3 className="text-lg text-gray-900 mb-4">
                    Características
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {characteristics.map((char, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            char.value ? "bg-green-100" : "bg-red-100"
                          }`}
                        >
                          {char.value ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            char.value ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {char.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shelter Info */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Refugio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="" alt={pet.shelterName} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {pet.shelterName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-gray-900">{pet.shelterName}</h4>
                    <p className="text-sm text-gray-500">Refugio verificado</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={onStartChat}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Llamar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                </div>

                <Separator className="my-4" />

                <div className="text-sm text-gray-600">
                  <p className="mb-2">📍 {pet.location}</p>
                  <p className="mb-2">⭐ 4.8/5 (124 reseñas)</p>
                  <p>🏠 127 adopciones exitosas</p>
                </div>
              </CardContent>
            </Card>

            {/* Adoption Action */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                {user ? (
                  <div className="space-y-4">
                    {user.role === "adopter" ? (
                      <Button
                        asChild
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl flex items-center justify-center"
                      >
                        <Link
                          href={`${PATHROUTES.ADOPTION}?petId=${pet.id}`}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          ¡Quiero adoptar a {pet.name}!
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-gray-400 text-white py-3 rounded-xl cursor-not-allowed"
                        disabled
                      >
                        Solo adoptantes pueden solicitar
                      </Button>
                    )}

                    <Button variant="outline" className="w-full">
                      Programar visita
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

            {/* Quick Info */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Información Rápida</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="text-gray-900">#{pet.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="text-gray-900">
                    {getTypeLabel(pet.type)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Raza:</span>
                  <span className="text-gray-900">{pet.breed}</span>
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

            {/* Emergency Contact */}
            <Card className="border-0 shadow-md bg-orange-50">
              <CardContent className="p-4">
                <h4 className="text-orange-800 mb-2">🚨 ¿Emergencia?</h4>
                <p className="text-sm text-orange-700 mb-3">
                  Si has encontrado a {pet.name} perdido, contacta
                  inmediatamente
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Reportar hallazgo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
