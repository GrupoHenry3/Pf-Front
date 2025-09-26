"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StepMotivation } from "@/components/adoptionApplication/steps/StepMotivation";
import { StepHousing } from "@/components/adoptionApplication/steps/StepHousing";
import { StepLifestyle } from "@/components/adoptionApplication/steps/StepLifestyle";
import { StepFamilyPets } from "@/components/adoptionApplication/steps/StepFamilyPets";
import type { ApplicationData } from "@/interfaces/Adoption";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { petsService } from "@/services/pets/petsService";
import { useAdoption } from "@/context/AdoptionContext";
import { AdoptionDTO } from "@/services/adoptions/adoptionsService";
import { Pet } from "@/interfaces/Pet";
import Link from "next/link";
import PATHROUTES from "../utils/PathRoutes.util";

export default function AdoptionPageWrapper() {
  const params = useParams();
  const petId = params?.id;
  const { user } = useUser();
  const { createAdoption } = useAdoption();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [fetchedPet, setFetchedPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<ApplicationData>({
    dni: "",
    birthDate: "",
    adoptionReason: "",
    expectations: "",
    petExperience: "",
    housingType: "",
    housingOwnership: "",
    yardSize: "",
    livingSpace: "",
    workSchedule: "",
    dailyRoutine: "",
    exerciseCommitment: "",
    travelFrequency: "",
    householdMembers: "",
    childrenAges: "",
    currentPets: "",
    petHistory: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const totalSteps = 4;

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          data.dni &&
          data.birthDate &&
          data.adoptionReason.length >= 50 &&
          data.expectations.length >= 30 &&
          data.petExperience
        );
      case 2:
        return data.housingType && data.housingOwnership && data.livingSpace;
      case 3:
        return data.workSchedule && data.dailyRoutine;
      case 4:
        return data.householdMembers;
      default:
        return true;
    }
  };

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(totalSteps, prev + 1));
  const handleBackStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  // Función para mapear valores del frontend a valores del backend
  const mapFrontendToBackendValues = (frontendValue: string, fieldType: string) => {
    const mappings: Record<string, Record<string, string>> = {
      previousPetExp: {
        'none': 'None',
        'basic': 'Basic', 
        'moderate': 'Moderate',
        'extensive': 'Experienced',
        'experienced': 'Experienced'
      },
      houseType: {
        'house': 'House',
        'apartment': 'Apartment',
        'farm': 'Farm'
      },
      houseOwnership: {
        'own': 'Owned',
        'owned': 'Owned',
        'rent': 'Rented',
        'rented': 'Rented'
      },
      houseOuterSpace: {
        'none': 'None',
        'small': 'Small',
        'medium': 'Medium',
        'large': 'Large'
      }
    };

    return mappings[fieldType]?.[frontendValue.toLowerCase()] || frontendValue;
  };

  const handleSubmitForm = async () => {
    if (!fetchedPet || !user || !fetchedPet.shelter || !fetchedPet.id) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const adoptionData: AdoptionDTO = {
        dni: data.dni,
        birthdate: data.birthDate,
        mainReason: data.adoptionReason,
        expectatives: data.expectations,
        previousPetExp: mapFrontendToBackendValues(data.petExperience, 'previousPetExp') as 'None' | 'Basic' | 'Moderate' | 'Experienced',
        houseType: mapFrontendToBackendValues(data.housingType, 'houseType') as 'House' | 'Apartment' | 'Farm',
        houseOwnership: mapFrontendToBackendValues(data.housingOwnership, 'houseOwnership') as 'Owned' | 'Rented',
        houseOuterSpace: mapFrontendToBackendValues(data.yardSize, 'houseOuterSpace') as 'None' | 'Small' | 'Medium' | 'Large',
        workingHours: data.workSchedule,
        dailyRoutine: data.dailyRoutine,
        houseMembers: data.householdMembers,
        livingSpace: data.livingSpace,
        houseKidsAges: data.childrenAges || undefined,
        houseCurrentPets: data.currentPets || undefined,
        dailyExcercise: data.exerciseCommitment || undefined,
        travelFrequency: data.travelFrequency || undefined,
        petHistory: data.petHistory || undefined,
        additionalInfo: data.additionalInfo || undefined,
        shelterID: fetchedPet.shelter.id || "", 
        petID: fetchedPet.id,
      };
      console.log(adoptionData);
      await createAdoption(adoptionData);
      window.alert("✅ Solicitud de adopción enviada con éxito");
      router.push("/dashboard/user");
    } catch (error: unknown) {
      console.error("Error al enviar solicitud:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error al enviar la solicitud de adopción";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      try {
        setLoading(true);
        const pet = await petsService.findOne(petId as string);
        setFetchedPet(pet);
      } catch (error) {
        console.error("Error al cargar la mascota:", error);
        setSubmitError("Error al cargar la información de la mascota");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepMotivation data={data} update={update} />;
      case 2:
        return <StepHousing data={data} update={update} />;
      case 3:
        return <StepLifestyle data={data} update={update} />;
      case 4:
        return <StepFamilyPets data={data} update={update} />;
      default:
        return null;
    }
  };

  const getProgress = () => (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        Botón único de Volver
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 flex items-left"
          >
            <Link href={PATHROUTES.DASHBOARD}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>
        </div>

        {/* Progreso */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Paso {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(getProgress())}% completado
            </span>
          </div>
          <Progress value={getProgress()} className="h-2 rounded-full" />
        </div>

        {/* Loading state */}
        {loading && (
          <Card className="mb-8 shadow-md">
            <CardContent className="p-6 text-center">
              <p>Cargando información de la mascota...</p>
            </CardContent>
          </Card>
        )}

        {/* Info de mascota */}
        {!loading && fetchedPet && (
          <Card className="mb-8 shadow-md">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start">
              <Image
                src={fetchedPet.avatarURL}
                alt={fetchedPet.name}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg mr-4 mb-4 sm:mb-0 shadow"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{fetchedPet.name}</h2>
                <p className="text-gray-600 mt-1">
                  {fetchedPet.breed.name} • {fetchedPet.age} años • {fetchedPet.gender}
                </p>
                <p className="mt-2 text-gray-700">{fetchedPet.breed.description}</p>
                <p className="mt-1 text-gray-500 text-sm">
                  Ubicación: {fetchedPet.shelter.city}, {fetchedPet.shelter.state}
                </p>
                <p className="mt-1 text-gray-500 text-sm">
                  Refugio: {fetchedPet.shelter.name}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulario del paso */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">{renderStep()}</CardContent>
        </Card>

        {/* Navegación de pasos */}
        <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleBackStep}
            disabled={currentStep === 1}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
            >
              Siguiente <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitForm}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
            >
              {isSubmitting ? "Enviando..." : "Enviar Solicitud"} <Send className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Alerta final */}
        {currentStep === totalSteps && validateStep(currentStep) && !submitError && (
          <Alert className="border-green-200 bg-green-50 mt-6 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription>
              <strong>¡Casi terminamos!</strong> Revisa tu información antes de
              enviar la solicitud.
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta de error */}
        {submitError && (
          <Alert className="border-red-200 bg-red-50 mt-6 flex items-center gap-2">
            <AlertDescription className="text-red-800">
              <strong>Error:</strong> {submitError}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
