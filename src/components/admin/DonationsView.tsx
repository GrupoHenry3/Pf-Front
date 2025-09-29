"use client";

import { useState } from "react";
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
  Building2,
  Calendar,
  User,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";

// Mock data para donaciones
interface Donation {
  id: string;
  amount: number;
  donorName: string;
  donorEmail: string;
  shelterName: string;
  shelterId: string;
  shelterAvatar?: string;
  date: Date;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
}

const mockDonations: Donation[] = [
  {
    id: "1",
    amount: 150000,
    donorName: "María González",
    donorEmail: "maria@example.com",
    shelterName: "Refugio San Francisco",
    shelterId: "1",
    shelterAvatar: "/placeholder-pet.jpg",
    date: new Date("2024-06-15"),
    status: "completed",
    paymentMethod: "Tarjeta de crédito"
  },
  {
    id: "2",
    amount: 75000,
    donorName: "Carlos Pérez",
    donorEmail: "carlos@example.com",
    shelterName: "Casa de Mascotas",
    shelterId: "2",
    shelterAvatar: "/placeholder-pet.jpg",
    date: new Date("2024-06-14"),
    status: "completed",
    paymentMethod: "Transferencia bancaria"
  },
  {
    id: "3",
    amount: 200000,
    donorName: "Laura Torres",
    donorEmail: "laura@example.com",
    shelterName: "Refugio San Francisco",
    shelterId: "1",
    shelterAvatar: "/placeholder-pet.jpg",
    date: new Date("2024-06-13"),
    status: "pending",
    paymentMethod: "PSE"
  },
  {
    id: "4",
    amount: 100000,
    donorName: "Ana Martínez",
    donorEmail: "ana@example.com",
    shelterName: "Amigos Peludos",
    shelterId: "3",
    shelterAvatar: "/placeholder-pet.jpg",
    date: new Date("2024-06-12"),
    status: "completed",
    paymentMethod: "Tarjeta de crédito"
  },
  {
    id: "5",
    amount: 50000,
    donorName: "Roberto Silva",
    donorEmail: "roberto@example.com",
    shelterName: "Casa de Mascotas",
    shelterId: "2",
    shelterAvatar: "/placeholder-pet.jpg",
    date: new Date("2024-06-11"),
    status: "failed",
    paymentMethod: "Tarjeta de débito"
  },
  {
    id: "6",
    amount: 300000,
    donorName: "Patricia López",
    donorEmail: "patricia@example.com",
    shelterName: "Refugio San Francisco",
    shelterId: "1",
    shelterAvatar: "/placeholder-pet.jpg",
    date: new Date("2024-06-10"),
    status: "completed",
    paymentMethod: "Transferencia bancaria"
  }
];

export function DonationsView() {
  const [donations] = useState<Donation[]>(mockDonations);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-600">Completada</Badge>;
      case "pending":
        return <Badge variant="outline">Pendiente</Badge>;
      case "failed":
        return <Badge variant="destructive">Fallida</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
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

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const completedDonations = donations.filter(d => d.status === "completed").length;
  const pendingDonations = donations.filter(d => d.status === "pending").length;
  const failedDonations = donations.filter(d => d.status === "failed").length;

  return (
    <div className="space-y-6">
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
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{pendingDonations}</p>
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
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{donation.donorName}</div>
                          <div className="text-sm text-gray-500">{donation.donorEmail}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={donation.shelterAvatar || "/placeholder-pet.jpg"}
                          alt={donation.shelterName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{donation.shelterName}</div>
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
                        {donation.paymentMethod}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {donation.date.toLocaleDateString('es-CO')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(donation.status)}
                        {getStatusBadge(donation.status)}
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

      {/* Resumen por refugio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Resumen por Refugio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(donations.map(d => d.shelterName))).map((shelterName) => {
              const shelterDonations = donations.filter(d => d.shelterName === shelterName);
              const totalAmount = shelterDonations.reduce((sum, d) => sum + d.amount, 0);
              const completedCount = shelterDonations.filter(d => d.status === "completed").length;
              
              return (
                <div key={shelterName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ImageWithFallback
                      src="/placeholder-pet.jpg"
                      alt={shelterName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{shelterName}</h4>
                      <p className="text-sm text-gray-600">{completedCount} donaciones completadas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(totalAmount)}</p>
                    <p className="text-sm text-gray-600">Total recaudado</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
