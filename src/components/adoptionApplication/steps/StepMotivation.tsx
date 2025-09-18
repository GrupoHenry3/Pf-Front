import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { useState } from "react";

interface MotivationData {
  dni: string;
  birthDate: string;
  adoptionReason: string;
  expectations: string;
  petExperience: string;
}

interface StepProps {
  data: MotivationData;
  update: (field: keyof MotivationData, value: string) => void;
}

export function StepMotivation({ data, update }: StepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let error = "";
    if (field === "dni") {
      if (!value.trim()) error = "El DNI es obligatorio";
      else if (value.trim().length < 7) error = "El DNI debe tener al menos 7 caracteres";
    }
    if (field === "birthDate") {
      if (!value) error = "La fecha de nacimiento es obligatoria";
      else {
        const date = new Date(value);
        if (isNaN(date.getTime())) error = "Fecha inválida";
        else if (date.getFullYear() < 1900 || date > new Date()) error = "Fecha no válida";
      }
    }
    if (field === "adoptionReason") {
      if (!value.trim()) error = "La razón principal es obligatoria";
      else if (value.trim().length < 50) error = "Debe tener al menos 50 caracteres";
    }
    if (field === "expectations") {
      if (!value.trim()) error = "Las expectativas son obligatorias";
      else if (value.trim().length < 30) error = "Debe tener al menos 30 caracteres";
    }
    if (field === "petExperience") {
      if (!value) error = "Debe seleccionar una opción";
    }

    setErrors(prev => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Información básica</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="dni">DNI *</Label>
          <Input
            id="dni"
            value={data.dni}
            onChange={e => update("dni", e.target.value)}
            onBlur={e => validateField("dni", e.target.value)}
            placeholder="Ingrese su DNI"
            className="mt-2"
          />
          {errors.dni && <p className="text-red-600 text-sm mt-1">{errors.dni}</p>}
        </div>

        <div>
          <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
          <Input
            id="birthDate"
            type="date"
            value={data.birthDate}
            onChange={e => update("birthDate", e.target.value)}
            onBlur={e => validateField("birthDate", e.target.value)}
            className="mt-2"
          />
          {errors.birthDate && <p className="text-red-600 text-sm mt-1">{errors.birthDate}</p>}
        </div>

        <div>
          <Label htmlFor="adoptionReason">Razón principal *</Label>
          <Textarea
            id="adoptionReason"
            value={data.adoptionReason}
            onChange={e => update("adoptionReason", e.target.value)}
            onBlur={e => validateField("adoptionReason", e.target.value)}
            placeholder="Explica por qué has decidido adoptar..."
            className="mt-2 min-h-24"
          />
          {errors.adoptionReason && <p className="text-red-600 text-sm mt-1">{errors.adoptionReason}</p>}
        </div>

        <div>
          <Label htmlFor="expectations">Expectativas *</Label>
          <Textarea
            id="expectations"
            value={data.expectations}
            onChange={e => update("expectations", e.target.value)}
            onBlur={e => validateField("expectations", e.target.value)}
            placeholder="Describe qué tipo de relación esperas..."
            className="mt-2"
          />
          {errors.expectations && <p className="text-red-600 text-sm mt-1">{errors.expectations}</p>}
        </div>

        <div>
          <Label>Experiencia previa con mascotas *</Label>
          <RadioGroup
            value={data.petExperience}
            onValueChange={v => {
              update("petExperience", v);
              validateField("petExperience", v);
            }}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="extensive" id="extensive" />
              <Label htmlFor="extensive">Mucha experiencia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="some" id="some" />
              <Label htmlFor="some">Algo de experiencia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="little" id="little" />
              <Label htmlFor="little">Poca experiencia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">Primera vez</Label>
            </div>
          </RadioGroup>
          {errors.petExperience && <p className="text-red-600 text-sm mt-1">{errors.petExperience}</p>}
        </div>
      </div>
    </div>
  );
}
