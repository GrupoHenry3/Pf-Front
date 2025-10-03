"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Calendar,  
  Phone, 
  Mail, 
  User, 
  Heart,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { useUser } from "@/context/UserContext";
import { adoptionsService, AdoptionWithRelations } from "@/services/adoptions/adoptionsService";
import { AdoptionActions } from "./AdoptionActions";

interface AdoptionDetailsProps {
  adoptionId: string;
}

export function AdoptionDetails({ adoptionId }: AdoptionDetailsProps) {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const router = useRouter();
  const [adoption, setAdoption] = useState<AdoptionWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const isShelterOwner = user?.shelter?.id === adoption?.shelterID;
  const isAdoptionOwner = user?.id === adoption?.userID;

  useEffect(() => {
    const fetchAdoption = async () => {
      try {
        setIsLoading(true);
        const response = await adoptionsService.findOne(adoptionId);
        setAdoption(response.data as AdoptionWithRelations);
      } catch (error) {
        console.error("Error fetching adoption:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (adoptionId) {
      fetchAdoption();
    }
  }, [adoptionId]);

  const handleStatusUpdate = async (newStatus: 'Approved' | 'Rejected', rejectionReason?: string) => {
    try {
      setIsUpdating(true);
      await adoptionsService.updateStatus(adoptionId, {
        status: newStatus,
        rejectionReason: rejectionReason
      });
      
      if (adoption) {
        setAdoption({
          ...adoption,
          status: newStatus,
          rejectionReason: rejectionReason
        });
      }
    } catch (error) {
      console.error("Error updating adoption status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          label: 'Pendiente',
          variant: 'secondary' as const,
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        };
      case 'approved':
        return {
          label: 'Aprobada',
          variant: 'default' as const,
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      case 'rejected':
        return {
          label: 'Rechazada',
          variant: 'destructive' as const,
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'withdrawn':
        return {
          label: 'Retirada',
          variant: 'outline' as const,
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      default:
        return {
          label: status,
          variant: 'secondary' as const,
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSizeLabel = (size: string) => {
    switch (size.toLowerCase()) {
      case 'small': return 'Pequeño';
      case 'medium': return 'Mediano';
      case 'large': return 'Grande';
      default: return size;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male': return 'Macho';
      case 'female': return 'Hembra';
      default: return gender;
    }
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de la adopción...</p>
        </div>
      </div>
    );
  }

  if (!adoption) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Adopción no encontrada</h2>
          <p className="text-gray-600 mb-4">La solicitud de adopción que buscas no existe o no tienes permisos para verla.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Verificar permisos
  if (!isAdoptionOwner && !isShelterOwner) {
    return (
      <div className="min-h-screen flex ">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso denegado</h2>
          <p className="text-gray-600 mb-4">No tienes permisos para ver esta solicitud de adopción.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(adoption.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Solicitud de Adopción
              </h1>
              <p className="text-lg text-gray-600">
                {adoption.pet.name}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
              <Badge variant={statusInfo.variant} className={statusInfo.bgColor}>
                {statusInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de la mascota */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Información de la Mascota
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <ImageWithFallback
                    src={adoption.pet.avatarURL}
                    alt={adoption.pet.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">{adoption.pet.name}</h3>
                  
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Edad:</span>
                    <span className="font-medium">{adoption.pet.age} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Género:</span>
                    <span className="font-medium">{getGenderLabel(adoption.pet.gender)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tamaño:</span>
                    <span className="font-medium">{getSizeLabel(adoption.pet.size)}</span>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información del solicitante y detalles */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del solicitante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Información del Solicitante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 mb-4">
                  <ImageWithFallback
                    src={adoption.user.avatarURL}
                    alt={adoption.user.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{adoption.user.fullName}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {adoption.user.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {adoption.user.phoneNumber}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">DNI:</span>
                    <span className="ml-2 font-medium">{adoption.dni}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Fecha de nacimiento:</span>
                    <span className="ml-2 font-medium">{adoption.birthdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de la solicitud */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Detalles de la Solicitud
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Motivo principal de adopción</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.mainReason}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expectativas</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.expectatives}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Experiencia previa con mascotas</h4>
                    <p className="text-gray-700">{adoption.previousPetExp}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tipo de vivienda</h4>
                    <p className="text-gray-700">{adoption.houseType}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Propiedad de la vivienda</h4>
                    <p className="text-gray-700">{adoption.houseOwnership}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Espacio exterior</h4>
                    <p className="text-gray-700">{adoption.houseOuterSpace}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Miembros del hogar</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.houseMembers}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Espacio de vida</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.livingSpace}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Horario de trabajo</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.workingHours}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Rutina diaria</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.dailyRoutine}</p>
                </div>
                
                {adoption.houseKidsAges && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Edades de los niños</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.houseKidsAges}</p>
                  </div>
                )}
                
                {adoption.houseCurrentPets && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mascotas actuales</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.houseCurrentPets}</p>
                  </div>
                )}
                
                {adoption.dailyExcercise && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Ejercicio diario</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.dailyExcercise}</p>
                  </div>
                )}
                
                {adoption.travelFrequency && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Frecuencia de viajes</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.travelFrequency}</p>
                  </div>
                )}
                
                {adoption.petHistory && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Historial con mascotas</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.petHistory}</p>
                  </div>
                )}
                
                {adoption.additionalInfo && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Información adicional</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{adoption.additionalInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información de la solicitud */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  Información de la Solicitud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fecha de solicitud:</span>
                    <span className="ml-2 font-medium">{formatDate(adoption.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Última actualización:</span>
                    <span className="ml-2 font-medium">{formatDate(adoption.updatedAt)}</span>
                  </div>
                </div>
                
                {adoption.rejectionReason && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Motivo de rechazo</h4>
                    <p className="text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
                      {adoption.rejectionReason}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Acciones para el refugio */}
            {isShelterOwner && adoption.status.toLowerCase() === 'pending' && (
              <AdoptionActions
                onStatusUpdate={handleStatusUpdate}
                isUpdating={isUpdating}
              />
            )}

            {/* Mensaje para el usuario */}
            {isAdoptionOwner && adoption.status.toLowerCase() === 'pending' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Solicitud en revisión</h4>
                      <p className="text-yellow-700 text-sm">
                        Tu solicitud está siendo revisada por el refugio. Te notificaremos cuando tengamos una respuesta.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensaje de aprobación */}
            {isAdoptionOwner && adoption.status.toLowerCase() === 'approved' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium text-green-800">¡Solicitud aprobada!</h4>
                      <p className="text-green-700 text-sm">
                        Tu solicitud de adopción ha sido aprobada. El refugio se pondrá en contacto contigo pronto.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Mensaje de rechazo */}
            {isAdoptionOwner && adoption.status.toLowerCase() === 'rejected' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-medium text-red-800">Solicitud rechazada</h4>
                      <p className="text-red-700 text-sm">
                        Lamentablemente, tu solicitud de adopción no ha sido aprobada. Puedes contactar al refugio para más información.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
