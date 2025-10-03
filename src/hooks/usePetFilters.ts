import { useState, useMemo } from "react";
import { Pet } from "@/interfaces/Pet";
import { AdvancedFilters } from "@/components/ui/PetFilters";
import { getPetStatus } from "@/utils/petStatusUtils";

export interface UsePetFiltersProps {
  pets: Pet[];
  initialFilters?: {
    searchTerm?: string;
    selectedType?: string;
    selectedSize?: string;
    selectedAge?: string;
    selectedGender?: string;
    selectedStatus?: string;
    selectedLocation?: string;
  };
}

export function usePetFilters({ pets, initialFilters = {} }: UsePetFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [selectedType, setSelectedType] = useState(initialFilters.selectedType || "all");
  const [selectedSize, setSelectedSize] = useState(initialFilters.selectedSize || "all");
  const [selectedAge, setSelectedAge] = useState(initialFilters.selectedAge || "all");
  const [selectedGender, setSelectedGender] = useState(initialFilters.selectedGender || "all");
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.selectedStatus || "all");
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.selectedLocation || "all");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    vaccinated: false,
    neutered: false,
    trained: false,
    goodWithKids: false,
    goodWithPets: false,
  });

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // Filtro de búsqueda
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.shelter?.city?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo (especie)
      const matchesType = selectedType === "all" || pet.species?.name.toLowerCase() === selectedType;

      // Filtro por tamaño
      const matchesSize = selectedSize === "all" || pet.size.toLowerCase() === selectedSize;

      // Filtro por edad
      const matchesAge =
        selectedAge === "all" ||
        (selectedAge === "young" && pet.age <= 2) ||
        (selectedAge === "adult" && pet.age > 2 && pet.age <= 6) ||
        (selectedAge === "senior" && pet.age > 6);

      // Filtro por género
      const matchesGender =
        selectedGender === "all" || pet.gender.toLowerCase() === selectedGender;

      // Filtro por estado
      const petStatus = getPetStatus(pet);
      const matchesStatus =
        selectedStatus === "all" || 
        (selectedStatus === "available" && petStatus === "available") ||
        (selectedStatus === "adopted" && petStatus === "adopted") ||
        (selectedStatus === "pending" && petStatus === "pending");

      // Filtro por ubicación
      const matchesLocation =
        selectedLocation === "all" || pet.shelter?.city?.toLowerCase().includes(selectedLocation.toLowerCase());

      // Filtros avanzados
      const matchesAdvanced = 
        (!advancedFilters.vaccinated || pet.vaccinated) &&
        (!advancedFilters.neutered || pet.neutered) &&
        (!advancedFilters.trained || pet.trained) &&
        (!advancedFilters.goodWithKids || pet.goodWithKids) &&
        (!advancedFilters.goodWithPets || pet.goodWithPets);

      return (
        matchesSearch &&
        matchesType &&
        matchesSize &&
        matchesAge &&
        matchesGender &&
        matchesStatus &&
        matchesLocation &&
        matchesAdvanced
      );
    });
  }, [
    pets,
    searchTerm,
    selectedType,
    selectedSize,
    selectedAge,
    selectedGender,
    selectedStatus,
    selectedLocation,
    advancedFilters,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedSize("all");
    setSelectedAge("all");
    setSelectedGender("all");
    setSelectedStatus("all");
    setSelectedLocation("all");
    setAdvancedFilters({
      vaccinated: false,
      neutered: false,
      trained: false,
      goodWithKids: false,
      goodWithPets: false,
    });
  };

  const hasActiveFilters = 
    searchTerm !== "" ||
    selectedType !== "all" ||
    selectedSize !== "all" ||
    selectedAge !== "all" ||
    selectedGender !== "all" ||
    selectedStatus !== "all" ||
    selectedLocation !== "all" ||
    Object.values(advancedFilters).some(Boolean);

  return {
    // Estados
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
    
    // Computed
    filteredPets,
    hasActiveFilters,
    
    // Actions
    resetFilters,
  };
}
