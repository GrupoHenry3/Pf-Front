"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { PetFilters } from "@/components/ui/PetFilters";
import { usePetFilters } from "@/hooks/usePetFilters";
import { useRouter } from "next/navigation";
import { usePet } from "@/context/PetContext";
import { Pet } from "@/interfaces/Pet";


export function PetCatalog() {
  const { petsToAdopt, isPetLoading } = usePet();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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
    setAdvancedFilters,
    filteredPets,
  } = usePetFilters({ pets: petsToAdopt });

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

  const router = useRouter();

  useEffect(() => {
    console.log(petsToAdopt);
  }, [petsToAdopt]);

  const handlePetDetail = (pet: Pet) => {
    router.push(`/dashboard/pet-detail/${pet.id}`);
  }

  if (isPetLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50"><div className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"><div className="mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              Encuentra tu compañero perfecto
            </h1>
            <p className="text-lg text-gray-600">
              {filteredPets.length} mascotas esperando un hogar
            </p>
          </div>        <PetFilters
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
          className="mb-8"
        /><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet) => (

                <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => handlePetDetail(pet)}>
                  <div className="h-48 w-full overflow-hidden">
                    <ImageWithFallback
                      src={pet.avatarURL}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
                      <Badge variant="secondary">{getTypeLabel(pet.name)}</Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {pet.breed?.name} • {pet.age} años • {getSizeLabel(pet.size)}
                    </p>

                    <div className="flex justify-between items-center mt-4">
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
                          className={`w-5 h-5 ${favorites.has(pet.id || "") ? "fill-red-500 text-red-500" : ""
                            }`}
                        />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
