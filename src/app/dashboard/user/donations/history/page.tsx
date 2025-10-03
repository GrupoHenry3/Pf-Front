"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useDonation } from "@/context/DonationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Calendar, DollarSign, Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/privateRoute/privateRoute";

const ITEMS_PER_PAGE = 10;

export default function DonationHistoryPage() {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const { userDonations, isDonationLoading } = useDonation();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular el total de páginas
  const totalPages = Math.ceil(userDonations.length / ITEMS_PER_PAGE);
  
  // Obtener las donaciones para la página actual
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDonations = userDonations.slice(startIndex, endIndex);

  // Calcular estadísticas
  const totalDonated = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = userDonations.filter(d => d.status === 'completed').length;
  const failedDonations = userDonations.filter(d => d.status === 'failed').length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial de donaciones...</p>
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
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Historial de Donaciones</h1>
            <p className="text-lg text-gray-600">
              Revisa todas tus donaciones y su impacto
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Total Donado</h3>
                    <p className="text-2xl font-bold text-green-600">${totalDonated.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">En {userDonations.length} donaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Donaciones Exitosas</h3>
                    <p className="text-2xl font-bold text-blue-600">{completedDonations}</p>
                    <p className="text-sm text-gray-500">Completadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Impacto</h3>
                    <p className="text-2xl font-bold text-orange-600">{completedDonations}</p>
                    <p className="text-sm text-gray-500">Refugios ayudados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          {isDonationLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-500 mr-3" />
              <p className="text-gray-600">Cargando donaciones...</p>
            </div>
          ) : userDonations.length === 0 ? (
            /* Empty State */
            <Card className="shadow-md">
              <CardContent className="text-center py-12">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes donaciones registradas
                </h3>
                <p className="text-gray-600 mb-6">
                  Cuando hagas una donación, aparecerá aquí con todos los detalles.
                </p>
                <Button 
                  onClick={() => router.push("/dashboard/donation")}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Hacer mi primera donación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Donations List */}
              <div className="space-y-4 mb-8">
                {currentDonations.map((donation) => (
                  <Card key={donation.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Gift className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                ${donation.amount.toLocaleString()}
                              </h3>
                              <Badge
                                variant={donation.status === 'completed' ? 'default' : 'secondary'}
                                className={
                                  donation.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {donation.status === 'completed' ? 'Completada' : 'Fallida'}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(donation.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </span>
                              </div>
                              {donation.shelter && (
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{donation.shelter.name}</span>
                                </div>
                              )}
                            </div>
                            {donation.message && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                "{donation.message}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">ID: {donation.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/dashboard/donation")}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Hacer nueva donación
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/user")}
                >
                  Volver al dashboard
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
