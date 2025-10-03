"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, MapPin, Phone, FileText, ArrowLeft, Upload, X, Loader2, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { useShelter } from "@/context/ShelterContext";
import { uploadToCloudinary } from "@/components/utils/uploadToCloudinary";

interface ShelterFormData {
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  phoneNumber: string;
  website: string;
  description: string;
  avatarURL?: string;
}

export default function ShelterRegistrationPage() {
  const router = useRouter();
  const { user } = useUser();
  const { createShelter } = useShelter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ShelterFormData>({
    name: "",
    country: "",
    state: "",
    city: "",
    address: "",
    phoneNumber: "",
    website: "",
    description: "",
    avatarURL: undefined,
  });

  const handleInputChange = (field: keyof ShelterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setAvatarError("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("La imagen debe ser menor a 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError(null);
    setAvatarSuccess(false);

    try {
      // Subir imagen a Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      console.log("Frontend - Image uploaded successfully:", imageUrl);

      // Actualizar el formulario con la nueva URL del avatar
      setFormData((prev) => ({ ...prev, avatarURL: imageUrl }));
      console.log("Frontend - formData updated with avatarURL:", imageUrl);

      setAvatarSuccess(true);
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => setAvatarSuccess(false), 3000);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setAvatarError((error as string) || "Error al subir la imagen");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarURL: undefined }));
    setAvatarError(null);
    setAvatarSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes estar autenticado para crear un refugio");
      return;
    }

    const requiredFields = ["name", "country", "state", "city", "address", "phoneNumber"];
    const missingFields = requiredFields.filter((field) => !formData[field as keyof ShelterFormData]);

    if (missingFields.length > 0) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Frontend - formData before sending:", formData);
      console.log("Frontend - formData.avatarURL:", formData.avatarURL);

      const shelterData = {
        name: formData.name,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        description: formData.description || undefined,
        ...(formData.avatarURL ? { avatarURL: formData.avatarURL } : {}),
      };

      console.log("Frontend - shelterData being sent:", shelterData);
      await createShelter(shelterData);

      toast.success("¡Refugio creado exitosamente! Ahora puedes gestionar mascotas.");
      router.push("/dashboard/shelter");
    } catch (error) {
      console.error("Error al crear refugio:", error);
      toast.error("Error al crear el refugio. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-green-50 via-white to-orange-50"></div>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 relative">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conviértete en Refugio</h1>
            <p className="text-gray-600">Únete a nuestra red de refugios y ayuda a encontrar hogares para mascotas</p>
          </div>
        </div>
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">Información del Refugio</CardTitle>
            <CardDescription className="text-gray-600">Completa la información de tu refugio para comenzar a publicar mascotas</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Avatar Success Alert */}
            {avatarSuccess && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">✅ Imagen de perfil subida exitosamente</AlertDescription>
              </Alert>
            )}

            {/* Avatar Error Alert */}
            {avatarError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">❌ {avatarError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-green-500" />
                  Información Básica
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Refugio *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej: Refugio San Francisco"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Cuéntanos sobre tu refugio, su misión y cómo ayuda a las mascotas..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="rounded-xl border-2 focus:ring-2 focus:ring-green-500 min-h-[100px]"
                    rows={4}
                  />
                </div>

                {/* Sección de Imagen de Perfil */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-500" />
                    Imagen de Perfil del Refugio
                  </h4>

                  <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={formData.avatarURL} alt="Shelter Avatar" />
                        <AvatarFallback className="bg-green-500 text-white text-lg">
                          <Building2 className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={isUploadingAvatar} />

                      <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploadingAvatar} className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          {isUploadingAvatar ? "Subiendo..." : "Subir Imagen"}
                        </Button>

                        {formData.avatarURL && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            disabled={isUploadingAvatar}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                            Quitar Imagen
                          </Button>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-2 max-w-48">JPG, PNG o GIF. Máximo 5MB. Esta será la imagen que represente a tu refugio.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-500" />
                  Ubicación
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">País *</Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="Ej: Colombia"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado/Departamento *</Label>
                    <Input
                      id="state"
                      type="text"
                      placeholder="Ej: Cundinamarca"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Ej: Bogotá"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección Completa *</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Ej: Calle 123 #45-67, Barrio Centro"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-500" />
                  Información de Contacto
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Teléfono *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Ej: +57 300 123 4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio Web</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="Ej: https://www.mirefugio.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="rounded-xl border-2 focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 py-3 rounded-xl border-2" disabled={isLoading}>
                  Cancelar
                </Button>

                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl" disabled={isLoading}>
                  {isLoading ? "Creando Refugio..." : "Crear Refugio"}
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">¿Qué sucede después?</p>
                    <p>
                      Una vez creado tu refugio, podrás agregar mascotas, gestionar solicitudes de adopción y recibir donaciones. Tu refugio será visible en nuestro directorio para que las personas
                      puedan encontrarte.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
