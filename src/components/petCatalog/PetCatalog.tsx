"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  ChevronDown,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";

interface PetCatalogProps {
  onViewPet: (pet: Pet) => void;º
}

export function PetCatalog({ onViewPet }: PetCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
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
          
          {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, raza o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="dog">Perros</SelectItem>
                  <SelectItem value="cat">Gatos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="small">Pequeño</SelectItem>
                  <SelectItem value="medium">Mediano</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedAge} onValueChange={setSelectedAge}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Edad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="young">Joven (0-2)</SelectItem>
                  <SelectItem value="adult">Adulto (3-6)</SelectItem>
                  <SelectItem value="senior">Senior (7+)</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="w-4 h-4 mr-2" />
                    Más filtros
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-3">Características</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="vaccinated" />
                          <label htmlFor="vaccinated" className="text-sm">Vacunado</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="neutered" />
                          <label htmlFor="neutered" className="text-sm">Esterilizado</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="trained" />
                          <label htmlFor="trained" className="text-sm">Entrenado</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="goodWithKids" />
                          <label htmlFor="goodWithKids" className="text-sm">Bueno con niños</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="goodWithPets" />
                          <label htmlFor="goodWithPets" className="text-sm">Bueno con otras mascotas</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

          {/* Grid de mascotas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (
              <Link
                key={pet.id}
                href={`/petDetail/${pet.id}`} // ✅ ruta dinámica según el id de la mascota
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
                          className={`w-5 h-5 ${favorites.has(pet.id) ? "fill-red-500 text-red-500" : ""
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
