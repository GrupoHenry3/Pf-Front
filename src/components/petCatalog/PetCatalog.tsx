"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Heart,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";

import { Sidebar } from "../sidebar/Sidebar";
import type { Pet } from "@/interfaces/Pet";
import type { User } from "@/interfaces/User";

// 👉 importa los datos mock
import { PETS } from "@/data/pets";
import Link from "next/link";

interface PetCatalogProps {
  onViewPet: (pet: Pet) => void;
  user?: User | null;
}

export function PetCatalog({ onViewPet }: PetCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // ---- FILTROS ----
  const filteredPets = PETS.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || pet.type === selectedType;
    const matchesSize = selectedSize === "all" || pet.size === selectedSize;
    const matchesAge =
      selectedAge === "all" ||
      (selectedAge === "cachorro" && pet.age <= 1) ||
      (selectedAge === "adolescente" && pet.age > 1 && pet.age <= 3) ||
      (selectedAge === "adulto" && pet.age > 3);
    const matchesGender =
      selectedGender === "all" || pet.gender === selectedGender;
    const matchesStatus =
      selectedStatus === "all" || pet.status === selectedStatus;
    const matchesLocation =
      selectedLocation === "all" || pet.location.includes(selectedLocation);

    return (
      matchesSearch &&
      matchesType &&
      matchesSize &&
      matchesAge &&
      matchesGender &&
      matchesStatus &&
      matchesLocation
    );
  });

  // ---- FAVORITOS ----
  const toggleFavorite = (petId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(petId)) {
      newFavorites.delete(petId);
    } else {
      newFavorites.add(petId);
    }
    setFavorites(newFavorites);
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar fijo */}
      <div className="w-64 border-r bg-white shadow-sm">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              Encuentra tu compañero perfecto
            </h1>
            <p className="text-lg text-gray-600">
              {filteredPets.length} mascotas esperando un hogar
            </p>
          </div>

          {/* Grid de mascotas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
<Link
  href="/petDetail"
  className="block"
>
  <Card className="overflow-hidden hover:shadow-lg transition cursor-pointer">
    {/* Imagen */}
    <div className="h-48 w-full overflow-hidden">
      <ImageWithFallback
        src={pet.images[0]}
        alt={pet.name}
        className="h-full w-full object-cover"
      />
    </div>

    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
        <Badge variant="secondary">{getTypeLabel(pet.type)}</Badge>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        {pet.breed} • {pet.age} años • {getSizeLabel(pet.size)}
      </p>

      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
        {pet.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-1" /> {pet.location}
        </span>
        <Button
          size="sm"
          onClick={(e) => {
            e.preventDefault(); // 👈 evita que el click dispare el Link
            toggleFavorite(pet.id, e);
          }}
          variant="ghost"
        >
          <Heart
            className={`w-5 h-5 ${
              favorites.has(pet.id) ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>
    </CardContent>
  </Card>
</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
