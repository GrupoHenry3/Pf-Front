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
import { petsService } from "@/services/pets/petsService";
import { getPetStatus, getPetStatusLabel, getPetStatusVariant } from "@/utils/petStatusUtils";

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
    const isActive = pet.isActive;
    setConfirmationModal({
      isOpen: true,
      title: isActive ? "Desactivar Mascota" : "Activar Mascota",
      description: isActive 
        ? `¿Estás seguro de que quieres desactivar la mascota "${pet.name}"? Esto la removerá del catálogo público.`
        : `¿Estás seguro de que quieres activar la mascota "${pet.name}"? Esto la agregará al catálogo público.`,
      type: isActive ? "danger" : "success",
      onConfirm: async () => {
        try {
          await petsService.updateStatus(pet.id || "");
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error(`Error al ${isActive ? 'desactivar' : 'activar'} mascota:`, error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const getStatusBadge = (pet: Pet) => {
    const statusBadges = [];
    
    // Badge de estado de adopción
    const status = getPetStatus(pet);
    const label = getPetStatusLabel(status);
    const variant = getPetStatusVariant(status);
    
    statusBadges.push(
      <Badge key="adoption" variant={variant}>
        {label}
      </Badge>
    );
    
    // Badge de estado activo/inactivo
    if (pet.isActive) {
      statusBadges.push(<Badge key="active" variant="default" className="bg-blue-600">Activo</Badge>);
    } else {
      statusBadges.push(<Badge key="active" variant="outline" className="border-gray-400 text-gray-600">Inactivo</Badge>);
    }
    
    return <div className="flex flex-col gap-1">{statusBadges}</div>;
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
                      {getStatusBadge(pet)}
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
                        <Button
                          size="sm"
                          variant={pet.isActive ? "destructive" : "default"}
                          onClick={() => handleToggleActive(pet)}
                          className={pet.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                        >
                          {pet.isActive ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <Heart className="w-4 h-4 mr-1" />
                              Activar
                            </>
                          )}
                        </Button>
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
