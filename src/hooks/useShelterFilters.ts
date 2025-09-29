import { useState, useMemo } from "react";
import { Shelter } from "@/interfaces/Shelter";

export interface UseShelterFiltersProps {
  shelters: Shelter[];
  initialFilters?: {
    searchTerm?: string;
    selectedStatus?: string;
    selectedVerification?: string;
    selectedLocation?: string;
  };
}

export function useShelterFilters({ shelters, initialFilters = {} }: UseShelterFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.selectedStatus || "all");
  const [selectedVerification, setSelectedVerification] = useState(initialFilters.selectedVerification || "all");
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.selectedLocation || "all");

  const filteredShelters = useMemo(() => {
    return shelters.filter((shelter) => {
      // Filtro de búsqueda
      const matchesSearch =
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.state?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por estado (activo/inactivo)
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && shelter.isActive !== false) ||
        (selectedStatus === "inactive" && shelter.isActive === false);

      // Filtro por verificación
      const matchesVerification =
        selectedVerification === "all" ||
        (selectedVerification === "verified" && shelter.isVerified === true) ||
        (selectedVerification === "unverified" && shelter.isVerified !== true);

      // Filtro por ubicación
      const matchesLocation =
        selectedLocation === "all" ||
        shelter.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        shelter.state?.toLowerCase().includes(selectedLocation.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesVerification &&
        matchesLocation
      );
    });
  }, [
    shelters,
    searchTerm,
    selectedStatus,
    selectedVerification,
    selectedLocation,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedVerification("all");
    setSelectedLocation("all");
  };

  const hasActiveFilters = 
    searchTerm !== "" ||
    selectedStatus !== "all" ||
    selectedVerification !== "all" ||
    selectedLocation !== "all";

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedVerification,
    setSelectedVerification,
    selectedLocation,
    setSelectedLocation,
    
    // Computed
    filteredShelters,
    hasActiveFilters,
    
    // Actions
    resetFilters,
  };
}
