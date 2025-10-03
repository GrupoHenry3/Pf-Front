import { useState, useMemo } from "react";
import { Pet } from "@/interfaces/Pet";
import { getPetStatus } from "@/utils/petStatusUtils";

export interface UseAdminPetFiltersProps {
  pets: Pet[];
  initialFilters?: {
    searchTerm?: string;
    selectedStatus?: string;
    selectedSpecies?: string;
    selectedSize?: string;
    selectedGender?: string;
    selectedLocation?: string;
  };
}

export function useAdminPetFilters({ pets, initialFilters = {} }: UseAdminPetFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.selectedStatus || "all");
  const [selectedSpecies, setSelectedSpecies] = useState(initialFilters.selectedSpecies || "all");
  const [selectedSize, setSelectedSize] = useState(initialFilters.selectedSize || "all");
  const [selectedGender, setSelectedGender] = useState(initialFilters.selectedGender || "all");
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.selectedLocation || "all");

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // Filtro de búsqueda
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.shelter?.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por estado
      const petStatus = getPetStatus(pet);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "available" && petStatus === "available") ||
        (selectedStatus === "adopted" && petStatus === "adopted") ||
        (selectedStatus === "pending" && petStatus === "pending");

      // Filtro por especie
      const matchesSpecies =
        selectedSpecies === "all" ||
        pet.species?.name.toLowerCase() === selectedSpecies.toLowerCase();

      // Filtro por tamaño
      const matchesSize = selectedSize === "all" || pet.size.toLowerCase() === selectedSize;

      // Filtro por género
      const matchesGender =
        selectedGender === "all" || pet.gender.toLowerCase() === selectedGender;

      // Filtro por ubicación
      const matchesLocation =
        selectedLocation === "all" ||
        pet.shelter?.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        pet.shelter?.state?.toLowerCase().includes(selectedLocation.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSpecies &&
        matchesSize &&
        matchesGender &&
        matchesLocation
      );
    });
  }, [
    pets,
    searchTerm,
    selectedStatus,
    selectedSpecies,
    selectedSize,
    selectedGender,
    selectedLocation,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedSpecies("all");
    setSelectedSize("all");
    setSelectedGender("all");
    setSelectedLocation("all");
  };

  const hasActiveFilters = 
    searchTerm !== "" ||
    selectedStatus !== "all" ||
    selectedSpecies !== "all" ||
    selectedSize !== "all" ||
    selectedGender !== "all" ||
    selectedLocation !== "all";

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedSpecies,
    setSelectedSpecies,
    selectedSize,
    setSelectedSize,
    selectedGender,
    setSelectedGender,
    selectedLocation,
    setSelectedLocation,
    
    // Computed
    filteredPets,
    hasActiveFilters,
    
    // Actions
    resetFilters,
  };
}
