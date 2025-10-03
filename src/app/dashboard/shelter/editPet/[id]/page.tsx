"use client";

import { useState, useEffect, use } from "react";
import { useUser } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRouter/ProtectedRoute";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSpecies } from "@/context/SpeciesContext";
import { useBreeds } from "@/context/BreedContext";
import { petsService } from "@/services/pets/petsService";
import { Pet } from "@/interfaces/Pet";
import toast from "react-hot-toast";
import Image from "next/image";

interface EditPetPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPetPage({ params }: EditPetPageProps) {
  const { user, isProfileLoaded, isUserLoading, isInitialized } = useUser();
  const router = useRouter();
  const { id } = use(params);
  const { species, isSpeciesLoading, createSpecies } = useSpecies();
  const { breeds, isBreedsLoading, createBreed } = useBreeds();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);

  // Estados para manejar selecciones
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
  const [selectedBreedId, setSelectedBreedId] = useState<string>("");
  const [newSpeciesName, setNewSpeciesName] = useState<string>("");
  const [newBreedName, setNewBreedName] = useState<string>("");
  const [newBreedDescription, setNewBreedDescription] = useState<string>("");
  const [newBreedAvatarURL, setNewBreedAvatarURL] = useState<string>("");
  const [showNewSpeciesInput, setShowNewSpeciesInput] = useState(false);
  const [showNewBreedInput, setShowNewBreedInput] = useState(false);

  const [formData, setFormData] = useState<Partial<Pet>>({
    name: "",
    age: 0,
    size: "Small",
    gender: "Male",
    description: "",
    photos: [],
    vaccinated: false,
    neutered: false,
    trained: false,
  });

  // Cargar datos de la mascota
  useEffect(() => {
    const loadPet = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const petData = await petsService.findOne(id);
        setPet(petData);
        
        // Llenar el formulario con los datos existentes
        setFormData({
          name: petData.name || "",
          age: petData.age || 0,
          size: petData.size,
          gender: petData.gender,
          description: petData.description || "",
          photos: petData.photos || [],
          vaccinated: petData.vaccinated || false,
          neutered: petData.neutered || false,
          trained: petData.trained || false,
        });

        // Establecer especie y raza seleccionadas
        if (petData.species?.id) {
          setSelectedSpeciesId(petData.species.id);
        }
        if (petData.breed?.id) {
          setSelectedBreedId(petData.breed.id);
        }
      } catch (error) {
        console.error("Error al cargar mascota:", error);
        setError("No se pudo cargar la información de la mascota");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPet();
    }
  }, [id]);

  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user?.shelter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h2>
          <p className="text-gray-600">Solo los refugios pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información de la mascota...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Mascota no encontrada"}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  const totalSteps = 4;

  const handleInputChange = (field: keyof Pet, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateSpecies = async () => {
    if (!newSpeciesName.trim()) return;
    
    try {
      const newSpecies = await createSpecies({ name: newSpeciesName.trim() });
      setSelectedSpeciesId(newSpecies.id || "");
      setNewSpeciesName("");
      setShowNewSpeciesInput(false);
    } catch (error) {
      console.error("Error creando especie:", error);
      toast.error("Error al crear la especie");
    }
  };

  const handleCreateBreed = async () => {
    if (!newBreedName.trim() || !newBreedDescription.trim() || !newBreedAvatarURL.trim() || !selectedSpeciesId) return;
    
    try {
      const breedData = {
        name: newBreedName.trim(),
        description: newBreedDescription.trim(),
        species: { id: selectedSpeciesId },
        avatarURL: newBreedAvatarURL.trim(),
      };
      const newBreed = await createBreed(breedData);
      setSelectedBreedId(newBreed.id || "");
      setNewBreedName("");
      setNewBreedDescription("");
      setNewBreedAvatarURL("");
      setShowNewBreedInput(false);
    } catch (error) {
      console.error("Error creando raza:", error);
      toast.error("Error al crear la raza");
    }
  };

  // Función para manejar selección de especie
  const handleSpeciesChange = (value: string) => {
    if (value === "other") {
      setShowNewSpeciesInput(true);
      setSelectedSpeciesId("");
    } else {
      setSelectedSpeciesId(value);
      setShowNewSpeciesInput(false);
      setNewSpeciesName("");
      // Limpiar raza seleccionada cuando cambia la especie
      setSelectedBreedId("");
      setShowNewBreedInput(false);
    }
  };

  // Función para manejar selección de raza
  const handleBreedChange = (value: string) => {
    if (value === "other") {
      if (!selectedSpeciesId) {
        toast.error("Primero debes seleccionar una especie antes de crear una nueva raza");
        return;
      }
      setShowNewBreedInput(true);
      setSelectedBreedId("");
    } else {
      setSelectedBreedId(value);
      setShowNewBreedInput(false);
      setNewBreedName("");
      setNewBreedDescription("");
      setNewBreedAvatarURL("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const formDataCloud = new FormData();
      formDataCloud.append("file", file);
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
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...uploadedUrls].slice(0, 5),
    }));
  };

  const removeImage = (index: number) => {
    const newImages = (formData.photos || []).filter((_: string, i: number) => i !== index);
    setFormData((prev) => ({ ...prev, photos: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar que tenemos los datos necesarios
      if (!formData.name || !selectedSpeciesId || !selectedBreedId || !formData.age) {
        toast.error("Por favor completa todos los campos obligatorios");
        return;
      }

      if (!user?.shelter?.id) {
        toast.error("Error: No se encontró información del refugio");
        return;
      }

      const avatarURL = (formData.photos && formData.photos.length > 0) ? formData.photos[0] : pet.avatarURL;

      // Preparar los datos según el DTO del backend
      const petData = {
        name: formData.name,
        age: Number(formData.age) || 0,
        gender: (formData.gender === 'Male' ? 'Male' : 'Female') as 'Male' | 'Female', 
        size: (formData.size === 'Small' ? 'Small' : formData.size === 'Medium' ? 'Medium' : 'Large') as 'Small' | 'Medium' | 'Large', 
        avatarURL: avatarURL,
        shelterID: user.shelter.id,
        breedID: selectedBreedId,
        speciesID: selectedSpeciesId,
        neutered: formData.neutered || false,
        vaccinated: formData.vaccinated || false,
        trained: formData.trained || false,
        goodWithKids: formData.goodWithKids || false,
        goodWithPets: formData.goodWithPets || false,
        adoptionFee: Number((formData as Pet & { adoptionFee?: number }).adoptionFee) || 0,
      };

      console.log("PetData a actualizar:", petData);

      // Usar el servicio para actualizar
      await petsService.update(id, petData);

      // Redirigir al dashboard del refugio
      router.push("/dashboard/shelter");
    } catch (error) {
      console.error("Error al actualizar la mascota:", error);
      toast.error("Hubo un error al actualizar la mascota. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.name && selectedSpeciesId && selectedBreedId && formData.age;
      case 2:
        return formData.size && formData.gender && (formData.description?.length || 0) >= 50;
      case 3:
        return (formData.photos && formData.photos.length > 0);
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
              <p className="text-gray-600">Modifica la información básica de {pet.name}</p>
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
                <Label>Especie *</Label>
                {isSpeciesLoading ? (
                  <div className="mt-2 text-gray-500">Cargando especies...</div>
                ) : (
                  <RadioGroup
                    value={selectedSpeciesId}
                    onValueChange={handleSpeciesChange}
                    className="grid grid-cols-2 gap-3 mt-2"
                  >
                    {species.filter(spec => spec.id).map((spec) => (
                      <div key={spec.id} className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                        <RadioGroupItem value={spec.id!} id={`species-${spec.id}`} />
                        <Label htmlFor={`species-${spec.id}`} className="cursor-pointer">
                          {spec.name}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                      <RadioGroupItem value="other" id="species-other" />
                      <Label htmlFor="species-other" className="cursor-pointer">
                        ➕ Otro
                      </Label>
                    </div>
                  </RadioGroup>
                )}
                
                {showNewSpeciesInput && (
                  <div className="mt-3 p-3 border border-green-200 rounded-lg bg-green-50">
                    <Label htmlFor="newSpecies">Nombre de la nueva especie *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="newSpecies"
                        placeholder="Ej: Conejo, Hámster, etc."
                        value={newSpeciesName}
                        onChange={(e) => setNewSpeciesName(e.target.value)}
                      />
                      <Button 
                        type="button" 
                        onClick={handleCreateSpecies}
                        disabled={!newSpeciesName.trim()}
                        size="sm"
                      >
                        Agregar
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>Raza *</Label>
                {isBreedsLoading ? (
                  <div className="mt-2 text-gray-500">Cargando razas...</div>
                ) : (
                  <RadioGroup
                    value={selectedBreedId}
                    onValueChange={handleBreedChange}
                    className="grid grid-cols-2 gap-3 mt-2"
                  >
                    {breeds
                      .filter(breed => breed.id && breed.species.id === selectedSpeciesId)
                      .map((breed) => (
                        <div key={breed.id} className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                          <RadioGroupItem value={breed.id!} id={`breed-${breed.id}`} />
                          <Label htmlFor={`breed-${breed.id}`} className="cursor-pointer">
                            {breed.name}
                          </Label>
                        </div>
                      ))}
                    <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
                      <RadioGroupItem value="other" id="breed-other" />
                      <Label htmlFor="breed-other" className="cursor-pointer">
                        ➕ Otro
                      </Label>
                    </div>
                  </RadioGroup>
                )}
                
                {!selectedSpeciesId && (
                  <p className="mt-2 text-sm text-gray-500">Primero selecciona una especie para ver las razas disponibles</p>
                )}
                
                {showNewBreedInput && (
                  <div className="mt-3 p-3 border border-green-200 rounded-lg bg-green-50">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="newBreed">Nombre de la nueva raza *</Label>
                        <Input
                          id="newBreed"
                          placeholder="Ej: Golden Retriever, Mestizo, etc."
                          value={newBreedName}
                          onChange={(e) => setNewBreedName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="newBreedDescription">Descripción de la raza *</Label>
                        <Textarea
                          id="newBreedDescription"
                          placeholder="Describe las características principales de esta raza..."
                          value={newBreedDescription}
                          onChange={(e) => setNewBreedDescription(e.target.value)}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newBreedAvatarURL">URL de imagen de la raza *</Label>
                        <Input
                          id="newBreedAvatarURL"
                          placeholder="https://ejemplo.com/imagen-raza.jpg"
                          value={newBreedAvatarURL}
                          onChange={(e) => setNewBreedAvatarURL(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <Button 
                        type="button" 
                        onClick={handleCreateBreed}
                        disabled={!newBreedName.trim() || !newBreedDescription.trim() || !newBreedAvatarURL.trim()}
                        size="sm"
                        className="w-full"
                      >
                        Agregar Raza
                      </Button>
                    </div>
                  </div>
                )}
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
              <p className="text-gray-600">Modifica las características de {formData.name}</p>
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
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-2 min-h-32"
                />
                <div className="mt-1 text-right">
                  <span className={`text-xs ${(formData.description?.length || 0) >= 50 ? 'text-green-600' : 'text-gray-500'}`}>
                    {formData.description?.length || 0}/50 caracteres mínimo
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Fotos</h2>
              <p className="text-gray-600">Modifica las fotos de {formData.name}</p>
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

              {(formData.photos && formData.photos.length > 0) && (
                <div>
                  <Label>Fotos seleccionadas ({(formData.photos || []).length}/5)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {(formData.photos || []).map((url: string, index: number) => (
                      <div key={index} className="relative group">
                        <Image
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={128}
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
             <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">Resumen del perfil actualizado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Nombre:</span>
                    <span className="text-green-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Especie:</span>
                    <span className="text-green-900">
                      {species.find(s => s.id === selectedSpeciesId)?.name || 'No seleccionada'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Raza:</span>
                    <span className="text-green-900">
                      {breeds.find(b => b.id === selectedBreedId)?.name || 'No seleccionada'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Edad:</span>
                    <span className="text-green-900">{formData.age} años</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Fotos:</span>
                    <span className="text-green-900">{(formData.photos || []).length} imagen(es)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Ubicación:</span>
                    <span className="text-green-900">{user?.shelter?.city}</span>
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <span className="text-gray-600">Paso {currentStep} de {totalSteps}</span>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Editar Mascota
            </h1>
            <p className="text-lg text-gray-600">
              Modifica la información de {pet.name}
            </p>
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
              <Button onClick={handleSubmit}>
                {isSubmitting ? "Actualizando..." : "Actualizar Mascota"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
