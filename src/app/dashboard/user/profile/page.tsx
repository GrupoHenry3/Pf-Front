"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { usersService } from "@/services/users/usersService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save, User, Mail, Phone, MapPin, Globe } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";

export default function UserProfilePage() {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updatedUser = await usersService.update({
        ...user,
        ...formData
      });

      // Actualizar el contexto del usuario
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      setSaveError(error?.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
      });
    }
    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
  };

  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!user || user.userType !== "User") {
    return null;
  }

  return (
    <ProtectedRoute allowedUserTypes={["User"]}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-lg text-gray-600">
              Gestiona tu información personal y de contacto
            </p>
          </div>

          {/* Success Alert */}
          {saveSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                ✅ Perfil actualizado exitosamente
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {saveError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                ❌ {saveError}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información del Avatar */}
            <div className="lg:col-span-1">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Foto de Perfil
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={user.avatarURL} alt={user.fullName} />
                    <AvatarFallback className="bg-green-500 text-white text-xl">
                      {user.fullName?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {user.role === "adopter" && "Adoptante"}
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Cambiar Foto
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Próximamente disponible
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Información Personal */}
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información Personal
                    </CardTitle>
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          size="sm"
                          disabled={isSaving}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleSave}
                          size="sm"
                          disabled={isSaving}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Guardar
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email (solo lectura) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      El correo electrónico no se puede modificar
                    </p>
                  </div>

                  {/* Nombre completo (solo lectura) */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre Completo
                    </Label>
                    <Input
                      id="fullName"
                      value={user.fullName || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">
                      El nombre completo no se puede modificar
                    </p>
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Número de Teléfono
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ej: +1 234 567 8900"
                      type="tel"
                    />
                  </div>

                  {/* Dirección */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ej: Calle 123, Colonia Centro"
                    />
                  </div>

                  {/* Ciudad */}
                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ciudad
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ej: Ciudad de México"
                    />
                  </div>

                  {/* País */}
                  <div className="space-y-2">
                    <Label htmlFor="country" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      País
                    </Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      disabled={!isEditing}
                      placeholder="Ej: México"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Información de la Cuenta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Miembro desde:</span>
                    <p className="text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Última actualización:</span>
                    <p className="text-gray-600">
                      {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado de la cuenta:</span>
                    <p className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? 'Activa' : 'Inactiva'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Tipo de usuario:</span>
                    <p className="text-gray-600">
                      {user.role === "adopter" && "Adoptante"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
