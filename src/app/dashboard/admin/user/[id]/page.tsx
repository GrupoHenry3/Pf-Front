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
  Mail,
  Calendar,
  User,
  Building2,
  Shield,
  CheckCircle,
  XCircle,
  Heart
} from "lucide-react";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { useUser } from "@/context/UserContext";
import { usePet } from "@/context/PetContext";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { UserInterface } from "@/interfaces/User";
import { usersService } from "@/services/users/usersService";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, totalUsers } = useUser();
  const { petsToAdopt } = usePet();
  const [user, setUser] = useState<UserInterface | null>(null);
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
    if (params.id && totalUsers.length > 0) {
      const foundUser = totalUsers.find(u => u.id === params.id);
      setUser(foundUser || null);
    }
  }, [params.id, totalUsers]);

  // Mock data para adopciones del usuario
  const userAdoptions = petsToAdopt.filter(pet => pet.status === 'adopted').slice(0, 3);

  const handleToggleActive = () => {
    if (!user) return;
    
    setConfirmationModal({
      isOpen: true,
      title: user.isActive ? "Desactivar Usuario" : "Activar Usuario",
      description: user.isActive 
        ? `¿Estás seguro de que quieres desactivar el usuario "${user.fullName}"? Esto impedirá que pueda acceder al sistema.`
        : `¿Estás seguro de que quieres activar el usuario "${user.fullName}"?`,
      type: user.isActive ? "danger" : "success",
      onConfirm: async () => {
        try {
          await usersService.updateStatus(user.id || "");
          // El contexto se actualizará automáticamente
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error("Error al cambiar estado del usuario:", error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const getTypeIcon = () => {
    if (!user) return null;
    switch (user.userType) {
      case "Shelter":
        return <Building2 className="h-6 w-6" />;
      case "Admin":
        return <Shield className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  const getTypeBadge = () => {
    if (!user) return null;
    switch (user.userType) {
      case "Shelter":
        return <Badge variant="secondary">Refugio</Badge>;
      case "Admin":
        return <Badge variant="destructive">Admin</Badge>;
      default:
        return <Badge variant="outline">Usuario</Badge>;
    }
  };

  const getStatusBadge = () => {
    if (!user) return null;
    if (!user.isActive) {
      return <Badge variant="destructive">Inactivo</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Activo</Badge>;
  };

  if (!currentUser || !currentUser.siteAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar user={currentUser} />
        <div className="flex-1 lg:ml-64 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center py-8">
              <p className="text-gray-600">Usuario no encontrado</p>
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
      <AdminSidebar user={currentUser} />
      
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
                  {getTypeIcon()}
                  {user.fullName}
                </h1>
                <p className="text-gray-600 mt-2">Detalles del usuario</p>
              </div>
              <div className="flex items-center gap-3">
                {getTypeBadge()}
                {getStatusBadge()}
                <Button
                  variant={user.isActive ? "destructive" : "default"}
                  onClick={handleToggleActive}
                  className={user.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {user.isActive ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Activar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del Usuario</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <ImageWithFallback
                      src={user.avatarURL || "/placeholder-user.jpg"}
                      alt={user.fullName || "Usuario"}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{user.fullName}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getTypeBadge()}
                        {getStatusBadge()}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    {user.phoneNumber && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Teléfono</p>
                          <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                        </div>
                      </div>
                    )}

                    {user.address && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Dirección</p>
                          <p className="text-sm text-gray-600">{user.address}</p>
                          <p className="text-sm text-gray-600">{user.city}, {user.country}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Fecha de registro</p>
                        <p className="text-sm text-gray-600">
                          {user.createdAt.toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Adopciones del usuario */}
              {user.userType === "User" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Adopciones Realizadas ({userAdoptions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userAdoptions.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {userAdoptions.map((pet) => (
                          <div key={pet.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <ImageWithFallback
                              src={pet.avatarURL}
                              alt={pet.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{pet.name}</h4>
                              <p className="text-sm text-gray-600">{pet.breed?.name}</p>
                              <Badge variant="secondary" className="text-xs">
                                Adoptado
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Este usuario no ha realizado adopciones
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Información del refugio si es usuario tipo Shelter */}
              {user.userType === "Shelter" && user.shelter && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Información del Refugio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Nombre del refugio</p>
                        <p className="text-sm text-gray-600">{user.shelter.name}</p>
                      </div>
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-sm text-gray-600">
                          {user.shelter.address}, {user.shelter.city}, {user.shelter.state}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-sm text-gray-600">{user.shelter.phoneNumber}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar con estadísticas */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de usuario:</span>
                    <span className="font-semibold">{user.userType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    {getStatusBadge()}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registrado:</span>
                    <span className="font-semibold">
                      {user.createdAt.toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  {user.userType === "User" && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adopciones:</span>
                      <span className="font-semibold">{userAdoptions.length}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    onClick={handleToggleActive}
                    className="w-full"
                    size="sm"
                  >
                    {user.isActive ? "Desactivar Usuario" : "Activar Usuario"}
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
