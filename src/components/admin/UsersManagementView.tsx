"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Users, 
  User,
  Building2,
  Shield,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { useUserFilters } from "@/hooks/useUserFilters";
import { UserFilters } from "@/components/ui/UserFilters";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { UserInterface } from "@/interfaces/User";
import { useUser } from "@/context/UserContext";
import { usersService } from "@/services/users/usersService";

export function UsersManagementView() {
  const router = useRouter();
  const { totalUsers } = useUser();
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

  const {
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    selectedType,
    setSelectedType,
    selectedLocation,
    setSelectedLocation,
    filteredUsers,
    hasActiveFilters,
    resetFilters,
  } = useUserFilters({ users: totalUsers });

  const handleViewDetails = (userId: string) => {
    router.push(`/dashboard/admin/user/${userId}`);
  };

  const handleToggleActive = (user: UserInterface) => {
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
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        } catch (error) {
          console.error("Error al cambiar estado del usuario:", error);
          setConfirmationModal({ ...confirmationModal, isOpen: false });
        }
      },
    });
  };

  const getTypeIcon = (userType: string) => {
    switch (userType) {
      case "Shelter":
        return <Building2 className="w-4 h-4" />;
      case "Admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (userType: string) => {
    switch (userType) {
      case "Shelter":
        return <Badge variant="secondary">Refugio</Badge>;
      case "Admin":
        return <Badge variant="destructive">Admin</Badge>;
      default:
        return <Badge variant="outline">Usuario</Badge>;
    }
  };

  const getStatusBadge = (user: UserInterface) => {
    if (!user.isActive) {
      return <Badge variant="destructive">Inactivo</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Activo</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-4xl">
            <Users className="h-10 w-10" />
            Gestión de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            className="mb-6"
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <ImageWithFallback
                          src={user.avatarURL || "/placeholder-user.jpg"}
                          alt={user.fullName || "Usuario"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(user.userType)}
                        {getTypeBadge(user.userType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(user.id || "")}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "default"}
                          onClick={() => handleToggleActive(user)}
                          className={user.isActive ? "" : "bg-green-600 hover:bg-green-700"}
                        >
                          {user.isActive ? (
                            <>
                              <XCircle className="w-4 h-4 mr-1" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activar
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {hasActiveFilters 
                ? "No se encontraron usuarios con los filtros aplicados"
                : "No hay usuarios registrados"
              }
            </div>
          )}
        </CardContent>
      </Card>

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
