 "use client";
 // 🔹 IMPORTANTE: instala y configura Cloudinary antes
// npm install @cloudinary/url-gen @cloudinary/react

"use client";

import { useState } from "react";
import { ArrowLeft, Upload, X, Plus, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { User } from "@/interfaces/User";
import type { Pet } from "@/interfaces/Pet";

interface AddPetProps {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
}

export function AddPet({ user, onBack, onSuccess }: AddPetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Pet>({
    name: "",
    type: "",
    breed: "",
    age: "",
    size: "",
    gender: "",
    description: "",
    images: [], // 🔹 ahora guardaremos URLs de Cloudinary aquí
    location: user.location || "",
    vaccinated: false,
    neutered: false,
    trained: false,
    goodWithKids: false,
    goodWithPets: false,
    specialNeeds: "",
    adoptionFee: "",
    emergencyContact: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  const handleInputChange = (field: keyof Pet, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔹 NUEVA FUNCIÓN: Subir imágenes a Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formDataCloud = new FormData();
      formDataCloud.append("file", file);

      // ⚠️ Reemplaza "tu_upload_preset" y "tu_cloud_name" con tus datos de Cloudinary
      formDataCloud.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET as string);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formDataCloud,
        });
        const data = await res.json();

        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        }
      } catch (error) {
        console.error("Error subiendo imagen a Cloudinary:", error);
      }
    }

    // 🔹 Guardamos las URLs en el formData
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls].slice(0, 5),
    }));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🔹 Ahora tus imágenes ya estarán en Cloudinary (URLs)
    console.log("Pet data submitted:", formData);

    setIsSubmitting(false);
    onSuccess();
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.type && formData.breed && formData.age;
      case 2:
        return formData.size && formData.gender && formData.description.length >= 50;
      case 3:
        return formData.images.length > 0;
      case 4:
        return formData.location;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
       case 1:
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Información Básica</h2>
        <p className="text-gray-600">Cuéntanos sobre tu mascota</p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre de la mascota *</Label>
          <Input
            id="name"
            placeholder="Ej: Luna"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Tipo de animal *</Label>
          <RadioGroup 
            value={formData.type} 
            onValueChange={(value) => handleInputChange('type', value)}
            className="grid grid-cols-3 gap-4 mt-2"
          >
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500">
              <RadioGroupItem value="dog" id="dog" />
              <Label htmlFor="dog">🐕 Perro</Label>
            </div>
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500">
              <RadioGroupItem value="cat" id="cat" />
              <Label htmlFor="cat">🐱 Gato</Label>
            </div>
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">🐰 Otro</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label htmlFor="breed">Raza *</Label>
          <Input
            id="breed"
            placeholder="Ej: Golden Retriever, Mestizo, etc."
            value={formData.breed}
            onChange={(e) => handleInputChange('breed', e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="age">Edad *</Label>
          <Input
            id="age"
            type="number"
            placeholder="Ej: 3"
            min="0"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Características</h2>
              <p className="text-gray-600">Ayuda a los adoptantes a conocer mejor a {formData.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Tamaño *</Label>
                <RadioGroup 
                  value={formData.size} 
                  onValueChange={(value) => handleInputChange('size', value)}
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                    <RadioGroupItem value="small" id="small" />
                    <Label htmlFor="small" className="cursor-pointer">
                      <div>Pequeño</div>
                      <div className="text-xs text-gray-500">Hasta 10kg</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="cursor-pointer">
                      <div>Mediano</div>
                      <div className="text-xs text-gray-500">10-25kg</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                    <RadioGroupItem value="large" id="large" />
                    <Label htmlFor="large" className="cursor-pointer">
                      <div>Grande</div>
                      <div className="text-xs text-gray-500">Más de 25kg</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Género *</Label>
                <RadioGroup 
                  value={formData.gender} 
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="grid grid-cols-2 gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">♂️ Macho</Label>
                  </div>
                  <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">♀️ Hembra</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="description">Descripción de la personalidad *</Label>
                <Textarea
                  id="description"
                  placeholder="Cuéntanos sobre la personalidad de tu mascota, qué le gusta hacer, cómo es con las personas, etc. (mínimo 50 caracteres)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-2 min-h-32"
                />
                <div className="mt-1 text-right">
                  <span className={`text-xs ${formData.description.length >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.description.length}/50 caracteres mínimo
                  </span>
                </div>
              </div>

              <div>
                <Label>Características de salud y comportamiento</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vaccinated" 
                      checked={formData.vaccinated}
                      onCheckedChange={(checked) => handleInputChange('vaccinated', checked)}
                    />
                    <Label htmlFor="vaccinated" className="text-sm">Vacunado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="neutered" 
                      checked={formData.neutered}
                      onCheckedChange={(checked) => handleInputChange('neutered', checked)}
                    />
                    <Label htmlFor="neutered" className="text-sm">Esterilizado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="trained" 
                      checked={formData.trained}
                      onCheckedChange={(checked) => handleInputChange('trained', checked)}
                    />
                    <Label htmlFor="trained" className="text-sm">Entrenado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="goodWithKids" 
                      checked={formData.goodWithKids}
                      onCheckedChange={(checked) => handleInputChange('goodWithKids', checked)}
                    />
                    <Label htmlFor="goodWithKids" className="text-sm">Bueno con niños</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="goodWithPets" 
                      checked={formData.goodWithPets}
                      onCheckedChange={(checked) => handleInputChange('goodWithPets', checked)}
                    />
                    <Label htmlFor="goodWithPets" className="text-sm">Bueno con otras mascotas</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="specialNeeds">Necesidades especiales (opcional)</Label>
                <Textarea
                  id="specialNeeds"
                  placeholder="¿Tiene alguna condición médica o necesidades especiales que los adoptantes deban conocer?"
                  value={formData.specialNeeds}
                  onChange={(e) => handleInputChange('specialNeeds', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );
      // 🔹 Paso 3 modificado: ahora muestra previews de URLs de Cloudinary
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Fotos</h2>
              <p className="text-gray-600">Sube fotos que muestren la personalidad de {formData.name}</p>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">Subir fotos</h3>
                  <p className="text-gray-500 mb-4">Arrastra las imágenes aquí o haz clic para seleccionar</p>
                  <Button type="button" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Seleccionar fotos
                  </Button>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <Label>Fotos seleccionadas ({formData.images.length}/5)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-green-500 text-white">Principal</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">La primera imagen será la foto principal del perfil</p>
                </div>
              )}

              <Alert>
                <Heart className="w-4 h-4" />
                <AlertDescription>
                  <strong>Consejo:</strong> Las fotos de alta calidad aumentan las posibilidades de adopción en un 40%.
                  Incluye fotos del rostro, cuerpo completo y jugando o interactuando.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        );
        case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Detalles de Adopción</h2>
              <p className="text-gray-600">Información final para completar el perfil</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="Ciudad, País"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="adoptionFee">Tarifa de adopción (opcional)</Label>
                <Input
                  id="adoptionFee"
                  type="number"
                  placeholder="0"
                  value={formData.adoptionFee}
                  onChange={(e) => handleInputChange('adoptionFee', e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Esta tarifa ayuda a cubrir gastos veterinarios y cuidados
                </p>
              </div>

              <div>
                <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                <Input
                  id="emergencyContact"
                  placeholder="Teléfono o email para emergencias"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Summary Card */}
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Resumen del perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Nombre:</span>
                    <span className="text-green-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Tipo:</span>
                    <span className="text-green-900">
                      {formData.type === 'dog' ? 'Perro' : formData.type === 'cat' ? 'Gato' : 'Otro'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Raza:</span>
                    <span className="text-green-900">{formData.breed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Fotos:</span>
                    <span className="text-green-900">{formData.images.length} imagen(es)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Ubicación:</span>
                    <span className="text-green-900">{formData.location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <span className="text-gray-600">Paso {currentStep} de {totalSteps}</span>
        </div>
        {renderStep()}
        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
              Anterior
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button onClick={() => setCurrentStep((prev) => prev + 1)} disabled={!canProceedToNext()}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting || !canProceedToNext()}>
              {isSubmitting ? "Enviando..." : "Finalizar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
