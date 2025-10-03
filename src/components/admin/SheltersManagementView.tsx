"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, XCircle, Shield, MapPin, Phone, Globe } from "lucide-react";
import { useShelter } from "@/context/ShelterContext";
import { useShelterFilters } from "@/hooks/useShelterFilters";
import { ShelterFilters } from "@/components/ui/ShelterFilters";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { Shelter } from "@/interfaces/Shelter";
import { sheltersService } from "@/services/shelters/sheltersService";

export function SheltersManagementView() {
  const router = useRouter();
  const { shelters } = useShelter();
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
    selectedVerification,
    setSelectedVerification,
    selectedLocation,
    setSelectedLocation,
    filteredShelters,
    hasActiveFilters,
    resetFilters,
  } = useShelterFilters({ shelters });

  const handleViewDetails = (shelterId: string) => {
    router.push(`/dashboard/admin/shelter/${shelterId}`);
  };

  const handleVerifyShelter = (shelter: Shelter) => {
    setConfirmationModal({
      isOpen: true,
      title: "Verificar Refugio",
      description: `¿Estás seguro de que quieres verificar el refugio "${shelter.name}"? Esto agregará el badge de verificación.`,
      type: "success",
      onConfirm: async () => {
        try {
          await sheltersService.verifyShelter(shelter.id || "");
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error("Error al verificar refugio:", error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const handleToggleActive = (shelter: Shelter) => {
    const isActive = shelter.isActive;
    setConfirmationModal({
      isOpen: true,
      title: isActive ? "Desactivar Refugio" : "Activar Refugio",
      description: isActive
        ? `¿Estás seguro de que quieres desactivar el refugio "${shelter.name}"? Esto impedirá que aparezca en búsquedas.`
        : `¿Estás seguro de que quieres activar el refugio "${shelter.name}"? Esto permitirá que aparezca en búsquedas.`,
      type: isActive ? "danger" : "success",
      onConfirm: async () => {
        try {
          await sheltersService.updateStatus(shelter.id || "");
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error(`Error al ${isActive ? "desactivar" : "activar"} refugio:`, error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const getStatusBadge = (shelter: Shelter) => {
    return (
      <div className="flex flex-col gap-1">
        {shelter.isVerified ? (
          <Badge variant="default" className="bg-green-600">
            Verificado
          </Badge>
        ) : (
          <Badge variant="secondary">No verificado</Badge>
        )}
        {shelter.isActive ? (
          <Badge variant="default" className="bg-blue-600">
            Activo
          </Badge>
        ) : (
          <Badge variant="outline" className="border-gray-400 text-gray-600">
            Inactivo
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <header className="text-4xl font-medium">Refugios</header>
      <Card>
        <CardContent className="pt-6">
          <ShelterFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedVerification={selectedVerification}
            setSelectedVerification={setSelectedVerification}
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
                  <TableHead>Refugio</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShelters.map((shelter) => (
                  <TableRow key={shelter.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback src={shelter.avatarURL || "/placeholder-pet.jpg"} alt={shelter.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-medium">{shelter.name}</div>
                          {shelter.website && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Globe className="w-3 h-3 mr-1" />
                              <a href={shelter.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                Sitio web
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <div>
                          <div>
                            {shelter.city}, {shelter.state}
                          </div>
                          <div className="text-xs text-gray-500">{shelter.country}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {shelter.phoneNumber}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(shelter)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(shelter.id || "")}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>

                        {/* Botón de verificación - solo mostrar si NO está verificado */}
                        {!shelter.isVerified && (
                          <Button size="sm" variant="default" onClick={() => handleVerifyShelter(shelter)} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Verificar
                          </Button>
                        )}

                        {/* Botón de activación/desactivación */}
                        <Button
                          size="sm"
                          variant={shelter.isActive ? "destructive" : "default"}
                          onClick={() => handleToggleActive(shelter)}
                          className={shelter.isActive ? "" : "bg-blue-600 hover:bg-blue-700"}
                        >
                          {shelter.isActive ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
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

          {filteredShelters.length === 0 && (
            <div className="text-center py-8 text-gray-500">{hasActiveFilters ? "No se encontraron refugios con los filtros aplicados" : "No hay refugios registrados"}</div>
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
