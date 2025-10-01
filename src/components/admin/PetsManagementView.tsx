"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  XCircle, 
  Heart, 
  Building2
} from "lucide-react";
import { usePet } from "@/context/PetContext";
import { useAdminPetFilters } from "@/hooks/useAdminPetFilters";
import { AdminPetFilters } from "@/components/ui/AdminPetFilters";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { Pet } from "@/interfaces/Pet";

export function PetsManagementView() {
  const router = useRouter();
  const { allPets } = usePet();
  const [isLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: "warning" | "success" | "danger";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    type: "warning",
    onConfirm: () => {},
  });

  const {
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
    filteredPets,
    hasActiveFilters,
    resetFilters,
  } = useAdminPetFilters({ pets: allPets });

  const handleViewDetails = (petId: string) => {
    router.push(`/dashboard/admin/pet/${petId}`);
  };

  const handleToggleActive = (pet: Pet) => {
    setConfirmationModal({
      isOpen: true,
      title: "Desactivar Mascota",
      description: `¿Estás seguro de que quieres desactivar la mascota "${pet.name}"? Esto la removerá del catálogo público.`,
      type: "danger",
      onConfirm: () => {
        // Aquí iría la lógica para desactivar la mascota
        console.log('Desactivando mascota:', pet.id);
        setConfirmationModal({ ...confirmationModal, isOpen: false });
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="default" className="bg-green-600">Disponible</Badge>;
      case "adopted":
        return <Badge variant="secondary">Adoptado</Badge>;
      case "pending":
        return <Badge variant="outline">Pendiente</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
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

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Macho";
      case "female":
        return "Hembra";
      default:
        return gender;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-4xl">
            <Heart  className="h-10 w-10" />
            Gestión de Mascotas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminPetFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedSpecies={selectedSpecies}
            setSelectedSpecies={setSelectedSpecies}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            className="mb-6"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Especie/Raza</TableHead>
                  <TableHead>Edad/Tamaño</TableHead>
                  <TableHead>Refugio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPets.map((pet) => (
                  <TableRow key={pet.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={pet.avatarURL}
                          alt={pet.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{pet.name}</div>
                          <div className="text-sm text-gray-500">
                            {getGenderLabel(pet.gender)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pet.species?.name}</div>
                        <div className="text-sm text-gray-500">{pet.breed?.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pet.age?.toString()} años</div>
                        <div className="text-sm text-gray-500">{getSizeLabel(pet.size)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="w-4 h-4 mr-1" />
                        <div>
                          <div className="font-medium">{pet.shelter?.name}</div>
                          <div className="text-xs text-gray-500">
                            {pet.shelter?.city}, {pet.shelter?.state}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(pet.status || "available")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(pet.id || "")}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        {pet.status === "available" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleToggleActive(pet)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Desactivar
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters 
                ? "No se encontraron mascotas con los filtros aplicados"
                : "No hay mascotas registradas"
              }
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ ...confirmationModal, isOpen: false })}
        onConfirm={confirmationModal.onConfirm}
        title={confirmationModal.title}
        description={confirmationModal.description}
        type={confirmationModal.type}
        isLoading={isLoading}
      />
    </div>
  );
}
