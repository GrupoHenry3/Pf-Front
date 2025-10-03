"use client";
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
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { useDonation } from "@/context/DonationContext";



export function DonationsView() {

  const {donations} = useDonation();


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };


  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Calendar className="w-4 h-4 text-yellow-600" />;
      case "failed":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const totalDonations = donations.filter(d => d.status === "completed").reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = donations.filter(d => d.status === "completed").length;
  const failedDonations = donations.filter(d => d.status === "failed" || d.status === "pending").length;

  return (
    <div className="space-y-6 mt-6">
      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Recaudado</p>
                <p className="text-2xl font-bold">{formatCurrency(totalDonations)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold">{completedDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fallidas</p>
                <p className="text-2xl font-bold">{failedDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de donaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Historial de Donaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donante</TableHead>
                  <TableHead>Refugio</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
       
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.reverse().map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <ImageWithFallback
                            src={donation.user.avatarURL || "/placeholder-user.jpg"}
                            alt={donation.user.fullName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{donation.user.fullName}</div>
                          <small>{donation.user.email}</small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={donation.shelter.avatarURL || "/placeholder-pet.jpg"}
                          alt={donation.shelter.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{donation.shelter.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(donation.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {donation.status === "failed" || donation.status === "pending" ? (
                          <>
                            {getStatusIcon("failed")}
                            <Badge variant="destructive">Fallida</Badge>
                          </>
                        ) : (
                          <>
                            {getStatusIcon(donation.status)}
                            <Badge variant="default">Completada</Badge>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {donations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay donaciones registradas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
