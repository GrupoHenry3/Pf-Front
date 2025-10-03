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
  Building2,
  Calendar,
  Heart,
  CheckCircle,
  XCircle,
  Shield,
  User,
  FileText
} from "lucide-react";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { getPetStatus, getPetStatusLabel, getPetStatusVariant } from "@/utils/petStatusUtils";
import { useUser } from "@/context/UserContext";
import { usePet } from "@/context/PetContext";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { Pet } from "@/interfaces/Pet";

export default function PetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { petsToAdopt } = usePet();
  const [pet, setPet] = useState<Pet | null>(null);
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
    if (params.id && petsToAdopt.length > 0) {
      const foundPet = petsToAdopt.find(p => p.id === params.id);
      setPet(foundPet || null);
    }
  }, [params.id, petsToAdopt]);

  const handleToggleActive = () => {
    if (!pet) return;
    
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

  const getStatusBadge = () => {
    if (!pet) return null;
    const status = getPetStatus(pet);
    const label = getPetStatusLabel(status);
    const variant = getPetStatusVariant(status);
    return <Badge variant={variant}>{label}</Badge>;
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

  if (!user || !user.siteAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar user={user} />
        <div className="flex-1 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-8">
              <p className="text-gray-600">Mascota no encontrada</p>
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
      
      <div className="flex-1 p-6">
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
                  <Heart className="h-8 w-8" />
                  {pet.name}
                </h1>
                <p className="text-gray-600 mt-2">Detalles de la mascota</p>
              </div>
              <div className="flex items-center gap-3">
                {getStatusBadge()}
                {pet.status === "available" && (
                  <Button
                    variant="destructive"
                    onClick={handleToggleActive}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Desactivar
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Mascota</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <ImageWithFallback
                      src={pet.avatarURL}
                      alt={pet.name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{pet.name}</h3>
                      <p className="text-gray-600">{pet.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusBadge()}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Especie</p>
                        <p className="text-sm text-gray-600">{pet.species?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Raza</p>
                        <p className="text-sm text-gray-600">{pet.breed?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Edad</p>
                        <p className="text-sm text-gray-600">{pet.age} años</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Género</p>
                        <p className="text-sm text-gray-600">{getGenderLabel(pet.gender)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Tamaño</p>
                        <p className="text-sm text-gray-600">{getSizeLabel(pet.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Ubicación</p>
                        <p className="text-sm text-gray-600">
                          {pet.shelter?.city}, {pet.shelter?.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Características adicionales */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Características</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${pet.vaccinated ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Vacunado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${pet.neutered ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Esterilizado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${pet.trained ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Entrenado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${pet.goodWithKids ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Bueno con niños</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 ${pet.goodWithPets ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="text-sm">Bueno con otras mascotas</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información del refugio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Refugio Responsable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <ImageWithFallback
                      src={pet.shelter?.avatarURL || "/placeholder-pet.jpg"}
                      alt={pet.shelter?.name || "Refugio"}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{pet.shelter?.name}</h4>
                      <p className="text-sm text-gray-600">
                        {pet.shelter?.address}, {pet.shelter?.city}, {pet.shelter?.state}
                      </p>
                      <p className="text-sm text-gray-600">{pet.shelter?.phoneNumber}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/admin/shelter/${pet.shelter?.id}`)}
                    >
                      Ver Refugio
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Solicitudes de adopción (mock) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Solicitudes de Adopción (3)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ImageWithFallback
                            src="/placeholder-user.jpg"
                            alt="Usuario"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium">Usuario {i}</h4>
                            <p className="text-sm text-gray-600">usuario{i}@example.com</p>
                          </div>
                        </div>
                        <Badge variant="outline">Pendiente</Badge>
                      </div>
                    ))}
                  </div>
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
                    <span className="text-gray-600">Estado:</span>
                    {getStatusBadge()}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Edad:</span>
                    <span className="font-semibold">{pet.age} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tamaño:</span>
                    <span className="font-semibold">{getSizeLabel(pet.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Género:</span>
                    <span className="font-semibold">{getGenderLabel(pet.gender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Solicitudes:</span>
                    <span className="font-semibold">3</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pet.status === "available" && (
                    <Button
                      variant="destructive"
                      onClick={handleToggleActive}
                      className="w-full"
                      size="sm"
                    >
                      Desactivar Mascota
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/dashboard/admin/shelter/${pet.shelter?.id}`)}
                    className="w-full"
                    size="sm"
                  >
                    Ver Refugio
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
