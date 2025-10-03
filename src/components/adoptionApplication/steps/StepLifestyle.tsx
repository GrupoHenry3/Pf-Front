import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { useState } from "react";
import { ApplicationData } from "@/interfaces/Pet";

interface StepProps {
  data: ApplicationData;
  update: (field: string, value: string) => void;
}

export function StepLifestyle({ data, update }: StepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let error = "";
    if (field === "workSchedule") {
      if (!value.trim()) error = "El horario laboral es obligatorio";
      else if (value.trim().length < 20) error = "Describa al menos 20 caracteres";
    }
    if (field === "dailyRoutine") {
      if (!value.trim()) error = "La rutina diaria es obligatoria";
      else if (value.trim().length < 20) error = "Describa al menos 20 caracteres";
    }
    if (field === "exerciseCommitment") {
      if (value && value.trim().length < 10) error = "Describa al menos 10 caracteres o deje vacío";
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Estilo de vida</h2>
        <p className="text-gray-600">Hábitos diarios y rutinas para la mascota</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="workSchedule">Horario laboral *</Label>
          <Textarea
            id="workSchedule"
            value={data.workSchedule}
            onChange={e => update("workSchedule", e.target.value)}
            onBlur={e => validateField("workSchedule", e.target.value)}
            placeholder="Horas fuera de casa, teletrabajo, flexibilidad..."
            className="mt-2"
          />
          {errors.workSchedule && <p className="text-red-600 text-sm mt-1">{errors.workSchedule}</p>}
        </div>

        <div>
          <Label htmlFor="dailyRoutine">Rutina diaria *</Label>
          <Textarea
            id="dailyRoutine"
            value={data.dailyRoutine}
            onChange={e => update("dailyRoutine", e.target.value)}
            onBlur={e => validateField("dailyRoutine", e.target.value)}
            placeholder="Ejemplo: despertarse, paseos, alimentación..."
            className="mt-2"
          />
          {errors.dailyRoutine && <p className="text-red-600 text-sm mt-1">{errors.dailyRoutine}</p>}
        </div>

        <div>
          <Label htmlFor="exerciseCommitment">Compromiso con ejercicio diario</Label>
          <Textarea
            id="exerciseCommitment"
            value={data.exerciseCommitment}
            onChange={e => update("exerciseCommitment", e.target.value)}
            onBlur={e => validateField("exerciseCommitment", e.target.value)}
            placeholder="Tiempo dedicado a paseos o juegos"
            className="mt-2"
          />
          {errors.exerciseCommitment && <p className="text-red-600 text-sm mt-1">{errors.exerciseCommitment}</p>}
        </div>

        <div>
          <Label htmlFor="travelFrequency">Frecuencia de viajes</Label>
          <Textarea
            id="travelFrequency"
            value={data.travelFrequency}
            onChange={e => update("travelFrequency", e.target.value)}
            placeholder="Viajes frecuentes, duración, cuidados para la mascota..."
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
