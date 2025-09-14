"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
import type { Pet } from "@/./interfaces/Pet";
import PATHROUTES from "../utils/PathRoutes.util";
import Link from "next/link";

export default function AdoptionPageWrapper() {
  const user = { id: "user1", name: "Moritz" };
  const handleBack = () => console.log("Volver");
  const handleSubmit = (data: any) => console.log("Solicitud enviada:", data);

  const params = useParams();
  const petId = params?.id;

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

  const update = (field: keyof ApplicationData, value: string) => {
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

  const handleSubmitForm = () => {
    if (!fetchedPet) return;

    const submission = {
      ...data,
      petId: fetchedPet.id,
      applicantId: user.id,
      applicantDNI: data.dni,
      submissionDate: new Date().toISOString(),
      status: "new",
    };

    handleSubmit(submission);
  };

  useEffect(() => {
    if (!petId) return;

    const fetchPet = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/pets/${petId}`);
        if (!res.ok) throw new Error("Mascota no encontrada");
        const pet: Pet = await res.json();
        setFetchedPet(pet);
      } catch (error) {
        console.error(error);
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
      {/* Contenedor centrado con ancho limitado */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <Button
            asChild
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 mb-4 sm:mb-0 flex items-center"
          >
            <Link href={PATHROUTES.PET_DETAIL}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>
          {/* <span className="text-2xl font-semibold text-gray-900">
            Solicitud para {fetchedPet ? fetchedPet.name : "la mascota"}
          </span> */}
        </div>

        {/* Progress */}
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

        {/* Pet Info Card */}
        {fetchedPet && (
          <Card className="mb-8 shadow-md">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start">
              <img
                src={fetchedPet.images[0] || "/placeholder.png"}
                alt={fetchedPet.name}
                className="w-32 h-32 object-cover rounded-lg mr-4 mb-4 sm:mb-0 shadow"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{fetchedPet.name}</h2>
                <p className="text-gray-600 mt-1">
                  {fetchedPet.breed} • {fetchedPet.age} años •{" "}
                  {fetchedPet.gender}
                </p>
                <p className="mt-2 text-gray-700">{fetchedPet.description}</p>
                <p className="mt-1 text-gray-500 text-sm">
                  Ubicación: {fetchedPet.location}
                </p>
                <p className="mt-1 text-gray-500 text-sm">
                  Refugio: {fetchedPet.shelterName}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Step */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-6">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
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
  onClick={() => {
    handleSubmitForm();
    window.alert("✅ Solicitud enviada con éxito");
  }}
  disabled={!validateStep(currentStep)}
  className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
>
  Enviar Solicitud <Send className="w-4 h-4 ml-2" />
</Button>
          )}
        </div>

        {/* Final Alert */}
        {currentStep === totalSteps && validateStep(currentStep) && (
          <Alert className="border-green-200 bg-green-50 mt-6 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <AlertDescription>
              <strong>¡Casi terminamos!</strong> Revisa tu información antes de
              enviar la solicitud.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
