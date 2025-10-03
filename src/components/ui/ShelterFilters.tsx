"use client";

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
import { useState } from "react";

interface ShelterFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedVerification: string;
  setSelectedVerification: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

export function ShelterFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedVerification,
  setSelectedVerification,
  selectedLocation,
  setSelectedLocation,
  onResetFilters,
  hasActiveFilters,
  className = "",
}: ShelterFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Búsqueda principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar refugios por nombre, ciudad o estado..."
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
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedVerification} onValueChange={setSelectedVerification}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Verificación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="verified">Verificados</SelectItem>
            <SelectItem value="unverified">Sin verificar</SelectItem>
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
              Estado: {selectedStatus === "active" ? "Activos" : "Inactivos"}
            </Badge>
          )}
          {selectedVerification !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {selectedVerification === "verified" ? "Verificados" : "Sin verificar"}
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
