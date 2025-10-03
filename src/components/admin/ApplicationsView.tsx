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
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Eye,
  User,
  Heart,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { useAdoption } from "@/context/AdoptionContext";


export function ApplicationsView() {
  const {allAdoptions} = useAdoption();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendiente</Badge>;
      case "Approved":
        return <Badge variant="default" className="bg-green-600">Aprobada</Badge>;
      case "Rejected":
        return <Badge variant="destructive">Rechazada</Badge>;
      case "Withdrawn":
        return <Badge variant="secondary">Retirada</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const pendingCount = allAdoptions?.filter(a => a.status === "Pending").length || 0;
  const approvedCount = allAdoptions?.filter(a => a.status === "Approved").length || 0;
  const rejectedCount = allAdoptions?.filter(a => a.status === "Rejected").length || 0;
  const completedCount = allAdoptions?.filter(a => a.status === "Completed").length || 0;

  return (
    <div className="space-y-6">
         <CardHeader>
          <CardTitle className="flex items-center gap-2 text-4xl">
            <FileText  className="h-10 w-10" />
            Gestión de Adopciones
          </CardTitle>
        </CardHeader>
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold">{approvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Solicitudes de Adopción
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mascota</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead>Refugio</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAdoptions?.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={application.pet.avatarURL}
                          alt={application.pet.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{application.pet.name}</div>
                          <div className="text-sm text-gray-500">{application.pet.breed.name}</div> 
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{application.user.fullName}</div>
                          <div className="text-sm text-gray-500">{application.user.email}</div>
                          <div className="text-xs text-gray-400">
                            {application.previousPetExp}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          // src={application.shelter.avatarURL}
                          alt={application.shelter.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>

                          <div className="font-medium">{application.shelter.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {application.createdAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {(!allAdoptions || allAdoptions.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No hay solicitudes de adopción registradas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
