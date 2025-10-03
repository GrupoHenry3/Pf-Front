"use client";

import { useDonation } from "@/context/DonationContext";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, Calendar, MessageSquare, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function ShelterDonationsPage() {
  const { shelterDonations, isDonationLoading } = useDonation();
  const { user } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshDonations = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular refresh
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Fallida</Badge>;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalDonations = shelterDonations
    .filter(donation => donation.status === 'completed')
    .reduce((sum, donation) => sum + donation.amount, 0);

  const totalDonationsCount = shelterDonations.filter(donation => donation.status === 'completed').length;

  if (!user || user.userType !== 'Shelter') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h2>
          <p className="text-gray-600">Solo los refugios pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  if (isDonationLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando donaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="h-8 w-8 text-green-500" />
              Donaciones Recibidas
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona y visualiza todas las donaciones que ha recibido tu refugio
            </p>
          </div>
          <Button 
            onClick={refreshDonations} 
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Total Recibido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                {formatCurrency(totalDonations)}
              </div>
              <p className="text-xs text-green-700">
                De {totalDonationsCount} donaciones completadas
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Donaciones Totales
              </CardTitle>
              <Heart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {shelterDonations.length}
              </div>
              <p className="text-xs text-blue-700">
                Incluyendo pendientes y fallidas
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">
                Promedio por Donación
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {totalDonationsCount > 0 
                  ? formatCurrency(totalDonations / totalDonationsCount)
                  : formatCurrency(0)
                }
              </div>
              <p className="text-xs text-purple-700">
                De donaciones completadas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Historial de Donaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shelterDonations.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aún no has recibido donaciones
                </h3>
                <p className="text-gray-600">
                  Las donaciones que recibas aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {shelterDonations
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((donation) => (
                    <div
                      key={donation.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {formatCurrency(donation.amount)}
                            </h3>
                            <small className="text-sm text-gray-500">
                              {donation.sessionID}
                            </small>
                          </div>
                        </div>
                        <div className="text-right">
                          { donation.status !== 'completed' ? getStatusBadge("failed") : <Badge className="bg-green-100 text-green-800">Completada</Badge>}
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(donation.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {donation.message && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 italic">
                            {donation.message}
                          </p>
                        </div>
                      )}

                       {donation.failureReason && donation.status !== 'completed' && (
                         <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                           <p className="text-red-700 text-sm">
                             <strong>Razón del fallo:</strong> {donation.failureReason}
                           </p>
                         </div>
                       )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
