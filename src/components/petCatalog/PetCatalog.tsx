"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { usePet } from "@/context/PetContext";
import { Pet } from "@/interfaces/Pet";


export function PetCatalog() {
  const { petsToAdopt, isPetLoading } = usePet();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedGender] = useState("all");
  const [selectedStatus] = useState("all");
  const [selectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredPets = petsToAdopt.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.shelter.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || pet.species.name.toLowerCase() === selectedType;
    const matchesSize = selectedSize === "all" || pet.size.toLowerCase() === selectedSize;
    const matchesAge =
      selectedAge === "all" ||
      (selectedAge === "young" && pet.age <= 2) ||
      (selectedAge === "adult" && pet.age > 2 && pet.age <= 6) ||
      (selectedAge === "senior" && pet.age > 6);
    const matchesGender =
      selectedGender === "all" || pet.gender.toLowerCase() === selectedGender;
    const matchesStatus =
      selectedStatus === "all" || (pet.status ? "adopted" : "available") === selectedStatus;
    const matchesLocation =
      selectedLocation === "all" || pet.shelter.city?.includes(selectedLocation);

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
    router.push(`/dashboard/petDetail/${pet.id}`);
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
          </div><div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center"><div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, raza o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div><div className="flex flex-wrap gap-3 items-center">
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
        </div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
