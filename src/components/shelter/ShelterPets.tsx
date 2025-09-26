"use client";

import { useState } from "react";
import {
  Heart,
  MapPin,
  Plus,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { PetFilters } from "@/components/ui/PetFilters";
import { usePetFilters } from "@/hooks/usePetFilters";
import { useRouter } from "next/navigation";
import { Pet } from "@/interfaces/Pet";

interface ShelterPetsProps {
  pets: Pet[];
  isPetLoading: boolean;
  shelterId?: string;
  showAddButton?: boolean;
  onAddPet?: () => void;
  onEditPet?: (pet: Pet) => void;
}

export function ShelterPets({ 
  pets, 
  isPetLoading, 
  shelterId, 
  showAddButton = true,
  onAddPet,
  onEditPet 
}: ShelterPetsProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const router = useRouter();

  const {
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSize,
    setSelectedSize,
    selectedAge,
    setSelectedAge,
    selectedGender,
    setSelectedGender,
    selectedStatus,
    setSelectedStatus,
    selectedLocation,
    setSelectedLocation,
    advancedFilters,
    setAdvancedFilters,
    filteredPets,
    hasActiveFilters,
    resetFilters,
  } = usePetFilters({ pets });

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

  const getTypeLabel = (speciesName: string) => {
    switch (speciesName.toLowerCase()) {
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

  const getStatusLabel = (pet: Pet) => {
    if (pet.status === "adopted") return "Adoptado";
    if (pet.status === "pending") return "Pendiente";
    return "Disponible";
  };

  const getStatusVariant = (pet: Pet) => {
    if (pet.status === "adopted") return "secondary";
    if (pet.status === "pending") return "outline";
    return "default";
  };

  const handlePetDetail = (pet: Pet) => {
    router.push(`/dashboard/petDetail/${pet.id}`);
  };

  const handleEditPet = (pet: Pet, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditPet?.(pet);
  };

  if (isPetLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón de agregar */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mis Mascotas</h2>
          <p className="text-gray-600">
            {filteredPets.length} de {pets.length} mascotas
            {hasActiveFilters && " (filtradas)"}
          </p>
        </div>
        {showAddButton && (
          <Button onClick={onAddPet} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Agregar Mascota
          </Button>
        )}
      </div>

      {/* Filtros */}
      <PetFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedAge={selectedAge}
        setSelectedAge={setSelectedAge}
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onAdvancedFiltersChange={setAdvancedFilters}
        placeholder="Buscar mascotas por nombre, raza..."
      />

      {/* Botón de reset si hay filtros activos */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetFilters}>
            Limpiar filtros
          </Button>
        </div>
      )}

      {/* Grid de mascotas */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Heart className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? "No se encontraron mascotas" : "No tienes mascotas registradas"}
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters 
              ? "Intenta ajustar los filtros de búsqueda" 
              : "Comienza agregando tu primera mascota"
            }
          </p>
          {!hasActiveFilters && showAddButton && (
            <Button onClick={onAddPet} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar Primera Mascota
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => handlePetDetail(pet)}>
              <div className="h-48 w-full overflow-hidden relative">
                <ImageWithFallback
                  src={pet.avatarURL}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Badge variant={getStatusVariant(pet)}>
                    {getStatusLabel(pet)}
                  </Badge>
                  {onEditPet && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => handleEditPet(pet, e)}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                  <Badge variant="secondary">{getTypeLabel(pet.species?.name || "")}</Badge>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {pet.breed?.name} • {pet.age} años • {getSizeLabel(pet.size)}
                </p>

                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {pet.breed?.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" /> {pet.shelter?.city}, {pet.shelter?.state}
                  </span>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault(); 
                      toggleFavorite(pet.id || "", e);
                    }}
                    variant="ghost"
                  >
                    <Heart
                      className={`w-5 h-5 ${favorites.has(pet.id || "") ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
