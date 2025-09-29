import { useState, useMemo } from "react";
import { UserInterface } from "@/interfaces/User";

export interface UseUserFiltersProps {
  users: UserInterface[];
  initialFilters?: {
    searchTerm?: string;
    selectedStatus?: string;
    selectedType?: string;
    selectedLocation?: string;
  };
}

export function useUserFilters({ users, initialFilters = {} }: UseUserFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || "");
  const [selectedStatus, setSelectedStatus] = useState(initialFilters.selectedStatus || "all");
  const [selectedType, setSelectedType] = useState(initialFilters.selectedType || "all");
  const [selectedLocation, setSelectedLocation] = useState(initialFilters.selectedLocation || "all");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Filtro de búsqueda
      const matchesSearch =
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.city?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por estado (activo/inactivo)
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && user.isActive !== false) ||
        (selectedStatus === "inactive" && user.isActive === false);

      // Filtro por tipo de usuario
      const matchesType =
        selectedType === "all" ||
        (selectedType === "user" && user.userType === "User") ||
        (selectedType === "shelter" && user.userType === "Shelter") ||
        (selectedType === "admin" && user.userType === "Admin");

      // Filtro por ubicación
      const matchesLocation =
        selectedLocation === "all" ||
        user.city?.toLowerCase().includes(selectedLocation.toLowerCase()) ||
        user.country?.toLowerCase().includes(selectedLocation.toLowerCase());

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesLocation
      );
    });
  }, [
    users,
    searchTerm,
    selectedStatus,
    selectedType,
    selectedLocation,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedType("all");
    setSelectedLocation("all");
  };

  const hasActiveFilters = 
    searchTerm !== "" ||
    selectedStatus !== "all" ||
    selectedType !== "all" ||
    selectedLocation !== "all";

  return {
    // Estados
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    
    // Computed
    filteredUsers,
    hasActiveFilters,
    
    // Actions
    resetFilters,
  };
}
