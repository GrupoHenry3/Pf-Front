"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminPetFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedSpecies: string;
  setSelectedSpecies: (value: string) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  selectedGender: string;
  setSelectedGender: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export function AdminPetFilters({
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
  onResetFilters,
  hasActiveFilters,
  className = "",
}: AdminPetFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar mascotas por nombre, raza o refugio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros básicos */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="available">Disponibles</SelectItem>
            <SelectItem value="adopted">Adoptados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Especie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="dog">Perros</SelectItem>
            <SelectItem value="cat">Gatos</SelectItem>
            <SelectItem value="other">Otros</SelectItem>
          </SelectContent>
        </Select>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Más filtros
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            <div className="flex gap-3">
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tamaño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="small">Pequeño</SelectItem>
                  <SelectItem value="medium">Mediano</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="male">Macho</SelectItem>
                  <SelectItem value="female">Hembra</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ubicaciones</SelectItem>
                  <SelectItem value="bogotá">Bogotá</SelectItem>
                  <SelectItem value="medellín">Medellín</SelectItem>
                  <SelectItem value="cali">Cali</SelectItem>
                  <SelectItem value="barranquilla">Barranquilla</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Badges de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Búsqueda: &quot;{searchTerm}&quot;
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Estado: {selectedStatus === "available" ? "Disponibles" : 
                       selectedStatus === "adopted" ? "Adoptados" : "Pendientes"}
            </Badge>
          )}
          {selectedSpecies !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Especie: {selectedSpecies === "dog" ? "Perros" : 
                        selectedSpecies === "cat" ? "Gatos" : "Otros"}
            </Badge>
          )}
          {selectedSize !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Tamaño: {selectedSize === "small" ? "Pequeño" : 
                       selectedSize === "medium" ? "Mediano" : "Grande"}
            </Badge>
          )}
          {selectedGender !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Género: {selectedGender === "male" ? "Macho" : "Hembra"}
            </Badge>
          )}
          {selectedLocation !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Ubicación: {selectedLocation}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
