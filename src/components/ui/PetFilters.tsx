"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { Checkbox } from "./checkbox";

export interface PetFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedSize: string;
  setSelectedSize: (value: string) => void;
  selectedAge: string;
  setSelectedAge: (value: string) => void;
  selectedGender?: string;
  setSelectedGender?: (value: string) => void;
  selectedStatus?: string;
  setSelectedStatus?: (value: string) => void;
  selectedLocation?: string;
  setSelectedLocation?: (value: string) => void;
  showAdvancedFilters?: boolean;
  onAdvancedFiltersChange?: (filters: AdvancedFilters) => void;
  placeholder?: string;
  className?: string;
}

export interface AdvancedFilters {
  vaccinated: boolean;
  neutered: boolean;
  trained: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
}

export function PetFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedSize,
  setSelectedSize,
  selectedAge,
  setSelectedAge,
  selectedGender = "all",
  setSelectedGender,
  selectedStatus = "all",
  setSelectedStatus,
  selectedLocation = "all",
  setSelectedLocation,
  showAdvancedFilters = true,
  onAdvancedFiltersChange,
  placeholder = "Buscar por nombre, raza o ubicación...",
  className = "",
}: PetFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    vaccinated: false,
    neutered: false,
    trained: false,
    goodWithKids: false,
    goodWithPets: false,
  });

  const handleAdvancedFilterChange = (filter: keyof AdvancedFilters, value: boolean) => {
    const newFilters = { ...advancedFilters, [filter]: value };
    setAdvancedFilters(newFilters);
    onAdvancedFiltersChange?.(newFilters);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="perro">Perros</SelectItem>
              <SelectItem value="gato">Gatos</SelectItem>
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

          {setSelectedGender && (
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="male">Macho</SelectItem>
                <SelectItem value="female">Hembra</SelectItem>
              </SelectContent>
            </Select>
          )}

          {setSelectedStatus && (
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="adopted">Adoptado</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          )}

          {setSelectedLocation && (
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Ubicación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="bogota">Bogotá</SelectItem>
                <SelectItem value="medellin">Medellín</SelectItem>
                <SelectItem value="cali">Cali</SelectItem>
                <SelectItem value="barranquilla">Barranquilla</SelectItem>
              </SelectContent>
            </Select>
          )}

          {showAdvancedFilters && (
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
                        <Checkbox 
                          id="vaccinated" 
                          checked={advancedFilters.vaccinated}
                          onCheckedChange={(checked) => handleAdvancedFilterChange('vaccinated', checked as boolean)}
                        />
                        <label htmlFor="vaccinated" className="text-sm">Vacunado</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="neutered" 
                          checked={advancedFilters.neutered}
                          onCheckedChange={(checked) => handleAdvancedFilterChange('neutered', checked as boolean)}
                        />
                        <label htmlFor="neutered" className="text-sm">Esterilizado</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="trained" 
                          checked={advancedFilters.trained}
                          onCheckedChange={(checked) => handleAdvancedFilterChange('trained', checked as boolean)}
                        />
                        <label htmlFor="trained" className="text-sm">Entrenado</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="goodWithKids" 
                          checked={advancedFilters.goodWithKids}
                          onCheckedChange={(checked) => handleAdvancedFilterChange('goodWithKids', checked as boolean)}
                        />
                        <label htmlFor="goodWithKids" className="text-sm">Bueno con niños</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="goodWithPets" 
                          checked={advancedFilters.goodWithPets}
                          onCheckedChange={(checked) => handleAdvancedFilterChange('goodWithPets', checked as boolean)}
                        />
                        <label htmlFor="goodWithPets" className="text-sm">Bueno con otras mascotas</label>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
