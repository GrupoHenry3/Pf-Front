"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, MapPin, Phone, FileText, ArrowLeft } from "lucide-react";
import { sheltersService } from "@/services/shelters/sheltersService";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface ShelterFormData {
  name: string;
  country: string;
  state: string;
  city: string;
  address: string;
  phoneNumber: string;
  website: string;
  description: string;
}

export default function ShelterRegistrationPage() {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ShelterFormData>({
    name: "",
    country: "",
    state: "",
    city: "",
    address: "",
    phoneNumber: "",
    website: "",
    description: "",
  });

  const handleInputChange = (field: keyof ShelterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Debes estar autenticado para crear un refugio");
      return;
    }

    // Validar campos requeridos
    const requiredFields = ['name', 'country', 'state', 'city', 'address', 'phoneNumber'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof ShelterFormData]);
    
    if (missingFields.length > 0) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsLoading(true);

    try {
      const shelterData = {
        userID: user.id,
        name: formData.name,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        website: formData.website,
        description: formData.description || undefined,
      };

      await sheltersService.create(shelterData);
      
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 py-8">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Conviértete en Refugio
            </h1>
            <p className="text-gray-600">
              Únete a nuestra red de refugios y ayuda a encontrar hogares para mascotas
            </p>
          </div>
        </div>

        {/* Formulario */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">
              Información del Refugio
            </CardTitle>
            <CardDescription className="text-gray-600">
              Completa la información de tu refugio para comenzar a publicar mascotas
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Básica */}
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
              </div>

              {/* Ubicación */}
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

              {/* Contacto */}
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

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 py-3 rounded-xl border-2"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando Refugio..." : "Crear Refugio"}
                </Button>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">¿Qué sucede después?</p>
                    <p>
                      Una vez creado tu refugio, podrás agregar mascotas, gestionar solicitudes de adopción 
                      y recibir donaciones. Tu refugio será visible en nuestro directorio para que las personas 
                      puedan encontrarte.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
