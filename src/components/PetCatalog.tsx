"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Calendar,
  ChevronDown,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";

import type { Pet } from "@/interfaces/pet";
import type { User } from "@/interfaces/user";

interface PetCatalogProps {
  onViewPet: (pet: Pet) => void;
  user?: User | null;
}

export function PetCatalog({ onViewPet, user }: PetCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock data - en el futuro vendrá de la API
  const pets: Pet[] = [
    {
      id: "1",
      name: "Luna",
      type: "dog",
      breed: "Golden Retriever",
      age: 2,
      size: "large",
      gender: "female",
      description:
        "Luna es una perra muy cariñosa y juguetona. Le encanta estar con niños y es perfecta para familias activas.",
      images: [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop",
      ],
      location: "Madrid, España",
      shelterId: "1",
      shelterName: "Refugio San Francisco",
      vaccinated: true,
      neutered: true,
      trained: true,
      goodWithKids: true,
      goodWithPets: true,
      status: "available",
      dateAdded: "2024-02-15",
    },
    {
      id: "2",
      name: "Milo",
      type: "cat",
      breed: "Maine Coon",
      age: 1,
      size: "medium",
      gender: "male",
      description:
        "Milo es un gato tranquilo y afectuoso. Ideal para apartamentos y personas que buscan un compañero relajado.",
      images: [
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop",
      ],
      location: "Barcelona, España",
      shelterId: "2",
      shelterName: "Gatitos Felices",
      vaccinated: true,
      neutered: false,
      trained: false,
      goodWithKids: true,
      goodWithPets: false,
      status: "available",
      dateAdded: "2024-03-01",
    },
    // ... resto de mock data que ya tenés
  ];

  const filteredPets = pets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === "all" || pet.type === selectedType;
    const matchesSize = selectedSize === "all" || pet.size === selectedSize;
    const matchesAge =
      selectedAge === "all" ||
      (selectedAge === "cachorro" && pet.age <= 1) ||
      (selectedAge === "adolescente" && pet.age > 1 && pet.age <= 3) ||
      (selectedAge === "adulto" && pet.age > 3);
    const matchesGender =
      selectedGender === "all" || pet.gender === selectedGender;
    const matchesStatus =
      selectedStatus === "all" || pet.status === selectedStatus;
    const matchesLocation =
      selectedLocation === "all" || pet.location.includes(selectedLocation);

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

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dog":
        return "Perro";
      case "cat":
        return "Gato";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">
            Encuentra tu compañero perfecto
          </h1>
          <p className="text-lg text-gray-600">
            {filteredPets.length} mascotas esperando un hogar
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, raza o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="dog">Perros</SelectItem>
                  <SelectItem value="cat">Gatos</SelectItem>
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
        </div>

        {/* Pet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <Card 
              key={pet.id}
              className="border-0 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group"
              onClick={() => onViewPet(pet)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <ImageWithFallback 
                    src={pet.images[0]}
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {user ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      className={`absolute top-3 right-3 p-2 bg-white/80 hover:bg-white transition-colors ${
                        favorites.has(pet.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                      onClick={(e) => toggleFavorite(pet.id, e)}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(pet.id) ? 'fill-current' : ''}`} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white transition-colors text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert('Inicia sesión para guardar favoritos');
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-500 text-white">
                      Disponible
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                      {pet.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(pet.type)}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {pet.breed} • {pet.age} años • {getSizeLabel(pet.size)}
                  </p>

                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {pet.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {pet.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(pet.dateAdded).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Characteristics */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pet.vaccinated && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                        Vacunado
                      </Badge>
                    )}
                    {pet.neutered && (
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                        Esterilizado
                      </Badge>
                    )}
                    {pet.trained && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                        Entrenado
                      </Badge>
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-500">{pet.shelterName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">No se encontraron mascotas</h3>
            <p className="text-gray-500 mb-4">
              Intenta ajustar tus filtros de búsqueda para ver más resultados
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedSize('all');
                setSelectedAge('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
