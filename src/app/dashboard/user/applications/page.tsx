"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  MapPin, 
  Building2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";
import { AdoptionWithRelations } from "@/services/adoptions/adoptionsService";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";

const ITEMS_PER_PAGE = 5;

export default function UserApplicationsPage() {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<AdoptionWithRelations | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const totalPages = Math.ceil((user?.adoptions?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = (user?.adoptions as AdoptionWithRelations[] || []).slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" />Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50"><XCircle className="w-3 h-3 mr-1" />Rechazada</Badge>;
      case 'in_review':
        return <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50"><AlertCircle className="w-3 h-3 mr-1" />En Revisión</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewDetails = (application: AdoptionWithRelations) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedApplication(null);
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== "User") {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Solicitudes de Adopción</h1>
            <p className="text-lg text-gray-600">
              Revisa el estado de tus solicitudes de adopción
            </p>
          </div>

          {/* Loading State */}
          {isUserLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-500 mr-3" />
              <p className="text-gray-600">Cargando solicitudes...</p>
            </div>
          ) : user?.adoptions?.length === 0 ? (
            /* Empty State */
            <Card className="shadow-md">
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes solicitudes de adopción
                </h3>
                <p className="text-gray-600 mb-6">
                  Cuando envíes una solicitud de adopción, aparecerá aquí.
                </p>
                <Button 
                  onClick={() => window.location.href = '/dashboard/pet-catalog'}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Buscar Mascotas
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Applications List */}
              <div className="space-y-4 mb-8">
                {currentApplications.map((application) => (
                  <Card key={application.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Pet Image */}
                        <div className="flex-shrink-0">
                          <ImageWithFallback
                            src={application.pet?.avatarURL}
                            alt={application.pet?.name || "Mascota"}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg"
                           
                          />
                        </div>

                        {/* Application Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {application.pet?.name || "Mascota no disponible"}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {application.pet?.breed?.name} • {application.pet?.age} años • {application.pet?.gender}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Building2 className="w-4 h-4" />
                                <span>{application.shelter?.name}</span>
                                <MapPin className="w-4 h-4 ml-2" />
                                <span>{application.shelter?.city}, {application.shelter?.state}</span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2">
                              {getStatusBadge(application.status)}
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(application.createdAt).toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex-shrink-0">
                          <Button
                            onClick={() => handleViewDetails(application)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Application Details Modal */}
              {showDetails && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Detalles de la Solicitud
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={handleCloseDetails}>
                          Cerrar
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Pet Information */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Información de la Mascota</h3>
                        <div className="flex gap-6">
                          <ImageWithFallback
                            src={selectedApplication.pet?.avatarURL}
                            alt={selectedApplication.pet?.name || "Mascota"}
                            width={120}
                            height={120}
                            className="w-30 h-30 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">
                              {selectedApplication.pet?.name}
                            </h4>
                            <p className="text-gray-600 mb-2">
                              {selectedApplication.pet?.breed?.name} • {selectedApplication.pet?.age} años • {selectedApplication.pet?.gender}
                            </p>
                    
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Building2 className="w-4 h-4" />
                              <span>{selectedApplication.shelter?.name}</span>
                              <MapPin className="w-4 h-4 ml-2" />
                              <span>{selectedApplication.shelter?.city}, {selectedApplication.shelter?.state}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Application Status */}
                      <div className="border-b pb-6">
                        <h3 className="text-lg font-semibold mb-4">Estado de la Solicitud</h3>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(selectedApplication.status)}
                          <div className="text-sm text-gray-500">
                            <p>Enviada el: {new Date(selectedApplication.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</p>
                            {selectedApplication.updatedAt !== selectedApplication.createdAt && (
                              <p>Última actualización: {new Date(selectedApplication.updatedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Application Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Información de tu Solicitud</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">DNI</label>
                              <p className="text-gray-900">{selectedApplication.dni}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                              <p className="text-gray-900">
                                {new Date(selectedApplication.birthdate).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Experiencia con Mascotas</label>
                              <p className="text-gray-900">{selectedApplication.previousPetExp}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Tipo de Vivienda</label>
                              <p className="text-gray-900">{selectedApplication.houseType}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Propiedad de la Vivienda</label>
                              <p className="text-gray-900">{selectedApplication.houseOwnership}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">Espacio Exterior</label>
                              <p className="text-gray-900">{selectedApplication.houseOuterSpace}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Horario de Trabajo</label>
                              <p className="text-gray-900">{selectedApplication.workingHours}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Miembros del Hogar</label>
                              <p className="text-gray-900">{selectedApplication.houseMembers}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">Espacio de Vida</label>
                              <p className="text-gray-900">{selectedApplication.livingSpace}</p>
                            </div>
                            {selectedApplication.houseKidsAges && (
                              <div>
                                <label className="text-sm font-medium text-gray-700">Edades de los Niños</label>
                                <p className="text-gray-900">{selectedApplication.houseKidsAges}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Text Fields */}
                        <div className="mt-6 space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Motivo Principal de Adopción</label>
                            <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                              {selectedApplication.mainReason}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Expectativas</label>
                            <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                              {selectedApplication.expectatives}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Rutina Diaria</label>
                            <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                              {selectedApplication.dailyRoutine}
                            </p>
                          </div>
                          {selectedApplication.additionalInfo && (
                            <div>
                              <label className="text-sm font-medium text-gray-700">Información Adicional</label>
                              <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                                {selectedApplication.additionalInfo}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
