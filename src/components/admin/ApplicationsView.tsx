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
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Eye,
  User,
  Heart,
  Building2,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";

// Mock data para solicitudes de adopción
interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petAvatar: string;
  petBreed: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  shelterName: string;
  shelterId: string;
  shelterAvatar: string;
  applicationDate: Date;
  status: "pending" | "approved" | "rejected" | "completed";
  adoptionReason: string;
  housingType: string;
  hasExperience: boolean;
}

const mockApplications: AdoptionApplication[] = [
  {
    id: "1",
    petId: "1",
    petName: "Luna",
    petAvatar: "/placeholder-pet.jpg",
    petBreed: "Golden Retriever",
    applicantName: "María González",
    applicantEmail: "maria@example.com",
    applicantPhone: "+57 300 123 4567",
    shelterName: "Refugio San Francisco",
    shelterId: "1",
    shelterAvatar: "/placeholder-pet.jpg",
    applicationDate: new Date("2024-06-15"),
    status: "pending",
    adoptionReason: "Busco un compañero para mi familia, tengo experiencia con perros y mucho tiempo para cuidarlo.",
    housingType: "Casa con jardín",
    hasExperience: true
  },
  {
    id: "2",
    petId: "2",
    petName: "Michi",
    petAvatar: "/placeholder-pet.jpg",
    petBreed: "Persa",
    applicantName: "Carlos Pérez",
    applicantEmail: "carlos@example.com",
    applicantPhone: "+57 300 234 5678",
    shelterName: "Casa de Mascotas",
    shelterId: "2",
    shelterAvatar: "/placeholder-pet.jpg",
    applicationDate: new Date("2024-06-14"),
    status: "approved",
    adoptionReason: "Soy veterinario y busco darle un hogar amoroso a un gato que necesite cuidados especiales.",
    housingType: "Apartamento",
    hasExperience: true
  },
  {
    id: "3",
    petId: "3",
    petName: "Max",
    petAvatar: "/placeholder-pet.jpg",
    petBreed: "Labrador",
    applicantName: "Laura Torres",
    applicantEmail: "laura@example.com",
    applicantPhone: "+57 300 345 6789",
    shelterName: "Refugio San Francisco",
    shelterId: "1",
    shelterAvatar: "/placeholder-pet.jpg",
    applicationDate: new Date("2024-06-13"),
    status: "rejected",
    adoptionReason: "Quiero un perro para que cuide mi casa.",
    housingType: "Casa con patio",
    hasExperience: false
  },
  {
    id: "4",
    petId: "4",
    petName: "Nina",
    petAvatar: "/placeholder-pet.jpg",
    petBreed: "Mestizo",
    applicantName: "Ana Martínez",
    applicantEmail: "ana@example.com",
    applicantPhone: "+57 300 456 7890",
    shelterName: "Amigos Peludos",
    shelterId: "3",
    shelterAvatar: "/placeholder-pet.jpg",
    applicationDate: new Date("2024-06-12"),
    status: "completed",
    adoptionReason: "Tengo una familia amorosa y buscamos adoptar una mascota para darle todo nuestro cariño.",
    housingType: "Casa con jardín",
    hasExperience: true
  },
  {
    id: "5",
    petId: "5",
    petName: "Bella",
    petAvatar: "/placeholder-pet.jpg",
    petBreed: "Siamés",
    applicantName: "Roberto Silva",
    applicantEmail: "roberto@example.com",
    applicantPhone: "+57 300 567 8901",
    shelterName: "Casa de Mascotas",
    shelterId: "2",
    shelterAvatar: "/placeholder-pet.jpg",
    applicationDate: new Date("2024-06-11"),
    status: "pending",
    adoptionReason: "Soy estudiante y busco un compañero para estudiar juntos.",
    housingType: "Apartamento",
    hasExperience: false
  },
  {
    id: "6",
    petId: "6",
    petName: "Rocky",
    petAvatar: "/placeholder-pet.jpg",
    petBreed: "Bulldog",
    applicantName: "Patricia López",
    applicantEmail: "patricia@example.com",
    applicantPhone: "+57 300 678 9012",
    shelterName: "Refugio San Francisco",
    shelterId: "1",
    shelterAvatar: "/placeholder-pet.jpg",
    applicationDate: new Date("2024-06-10"),
    status: "pending",
    adoptionReason: "Tengo experiencia con perros grandes y busco darle un hogar permanente.",
    housingType: "Casa con jardín",
    hasExperience: true
  }
];

export function ApplicationsView() {
  const [applications] = useState<AdoptionApplication[]>(mockApplications);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Pendiente</Badge>;
      case "approved":
        return <Badge variant="default" className="bg-green-600">Aprobada</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rechazada</Badge>;
      case "completed":
        return <Badge variant="secondary">Completada</Badge>;
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

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;
  const rejectedCount = applications.filter(a => a.status === "rejected").length;
  const completedCount = applications.filter(a => a.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
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

      {/* Tabla de solicitudes */}
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
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={application.petAvatar}
                          alt={application.petName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{application.petName}</div>
                          <div className="text-sm text-gray-500">{application.petBreed}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">{application.applicantName}</div>
                          <div className="text-sm text-gray-500">{application.applicantEmail}</div>
                          <div className="text-xs text-gray-400">
                            {application.hasExperience ? "Con experiencia" : "Sin experiencia"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={application.shelterAvatar}
                          alt={application.shelterName}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{application.shelterName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {application.applicationDate.toLocaleDateString('es-CO')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(application.status)}
                        {getStatusBadge(application.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay solicitudes de adopción registradas
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
            {Array.from(new Set(applications.map(a => a.shelterName))).map((shelterName) => {
              const shelterApplications = applications.filter(a => a.shelterName === shelterName);
              const pending = shelterApplications.filter(a => a.status === "pending").length;
              const approved = shelterApplications.filter(a => a.status === "approved").length;
              const rejected = shelterApplications.filter(a => a.status === "rejected").length;
              const completed = shelterApplications.filter(a => a.status === "completed").length;
              
              return (
                <div key={shelterName} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <ImageWithFallback
                        src="/placeholder-pet.jpg"
                        alt={shelterName}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{shelterName}</h4>
                        <p className="text-sm text-gray-600">{shelterApplications.length} solicitudes totales</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                      <p className="text-xs text-gray-600">Pendientes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{approved}</p>
                      <p className="text-xs text-gray-600">Aprobadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{rejected}</p>
                      <p className="text-xs text-gray-600">Rechazadas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{completed}</p>
                      <p className="text-xs text-gray-600">Completadas</p>
                    </div>
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
