"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MapPin,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  Building2,
  Heart
} from "lucide-react";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { useUser } from "@/context/UserContext";
import { useShelter } from "@/context/ShelterContext";
import { usePet } from "@/context/PetContext";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Shelter } from "@/interfaces/Shelter";
import { sheltersService } from "@/services/shelters/sheltersService";

export default function ShelterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { shelters, getShelters } = useShelter();
  const { petsToAdopt } = usePet();
  const [shelter, setShelter] = useState<Shelter | null>(null);
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

  useEffect(() => {
    if (params.id && shelters.length > 0) {
      const foundShelter = shelters.find(s => s.id === params.id);
      setShelter(foundShelter || null);
    }
  }, [params.id, shelters]);

  const shelterPets = petsToAdopt.filter(pet => pet.shelter?.id === params.id);

  const handleVerifyShelter = () => {
    if (!shelter) return;
    
    setConfirmationModal({
      isOpen: true,
      title: "Verificar Refugio",
      description: `¿Estás seguro de que quieres verificar el refugio "${shelter.name}"? Esto agregará el badge de verificación.`,
      type: "success",
      onConfirm: async () => {
        try {
          await sheltersService.verifyShelter(shelter.id || "");
          // Actualizar el contexto de refugios
          await getShelters();
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error("Error al verificar refugio:", error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const handleToggleActive = () => {
    if (!shelter) return;
    
    setConfirmationModal({
      isOpen: true,
      title: "Desactivar Refugio",
      description: `¿Estás seguro de que quieres desactivar el refugio "${shelter.name}"? Esto impedirá que aparezca en búsquedas.`,
      type: "danger",
      onConfirm: async () => {
        try {
          await sheltersService.updateStatus(shelter.id || "");
          // Actualizar el contexto de refugios
          await getShelters();
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error("Error al desactivar refugio:", error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const getStatusBadge = () => {
    if (!shelter) return null;
    if (shelter.isVerified) {
      return <Badge variant="default" className="bg-green-600">Verificado</Badge>;
    }
    return <Badge variant="secondary">No verificado</Badge>;
  };

  if (!user || !user.siteAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  if (!shelter) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar user={user} />
        <div className="flex-1 lg:ml-64 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-8">
              <p className="text-gray-600">Refugio no encontrado</p>
              <Button 
                onClick={() => router.push('/dashboard/admin')}
                className="mt-4"
              >
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar user={user} />
      
      <div className="flex-1 lg:ml-64 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard/admin')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl text-gray-900 flex items-center gap-3">
                  <Building2 className="h-8 w-8" />
                  {shelter.name}
                </h1>
                <p className="text-gray-600 mt-2">Detalles del refugio</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge()}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={handleVerifyShelter}
                    disabled={shelter.isVerified}
                    className={shelter.isVerified ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {shelter.isVerified ? "Verificado" : "Verificar"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleToggleActive}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Desactivar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Refugio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <ImageWithFallback
                      src={shelter.avatarURL || "/placeholder-pet.jpg"}
                      alt={shelter.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{shelter.name}</h3>
                      {shelter.description && (
                        <p className="text-gray-600 mt-2">{shelter.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-sm text-gray-600">{shelter.address}</p>
                        <p className="text-sm text-gray-600">{shelter.city}, {shelter.state}</p>
                        <p className="text-sm text-gray-600">{shelter.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-sm text-gray-600">{shelter.phoneNumber}</p>
                      </div>
                    </div>

                    {shelter.website && (
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Sitio Web</p>
                          <a 
                            href={shelter.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {shelter.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Mascotas del refugio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Mascotas del Refugio ({shelterPets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shelterPets.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {shelterPets.slice(0, 6).map((pet) => (
                        <div key={pet.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <ImageWithFallback
                            src={pet.avatarURL}
                            alt={pet.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{pet.name}</h4>
                            <p className="text-sm text-gray-600">{pet.breed?.name}</p>
                            <Badge 
                              variant={pet.status === 'available' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {pet.status === 'available' ? 'Disponible' : 
                               pet.status === 'adopted' ? 'Adoptado' : 'Pendiente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Este refugio no tiene mascotas registradas
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar con estadísticas */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de mascotas:</span>
                    <span className="font-semibold">{shelterPets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disponibles:</span>
                    <span className="font-semibold">
                      {shelterPets.filter(p => p.status === 'available').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adoptadas:</span>
                    <span className="font-semibold">
                      {shelterPets.filter(p => p.status === 'adopted').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    {getStatusBadge()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="default"
                    onClick={handleVerifyShelter}
                    disabled={shelter.isVerified}
                    className={`w-full ${shelter.isVerified ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                    size="sm"
                  >
                    {shelter.isVerified ? "Verificado" : "Verificar Refugio"}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleToggleActive}
                    className="w-full"
                    size="sm"
                  >
                    Desactivar Refugio
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

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
