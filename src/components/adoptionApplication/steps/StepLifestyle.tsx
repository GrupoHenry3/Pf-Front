import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

interface StepProps {
  data: any;
  update: (field: string, value: string) => void;
}

export function StepLifestyle({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Estilo de vida</h2>
        <p className="text-gray-600">Hábitos diarios y rutinas para la mascota</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="workSchedule">Horario laboral *</Label>
          <Textarea id="workSchedule" value={data.workSchedule} onChange={e => update('workSchedule', e.target.value)} placeholder="Horas fuera de casa, teletrabajo, flexibilidad..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="dailyRoutine">Rutina diaria *</Label>
          <Textarea id="dailyRoutine" value={data.dailyRoutine} onChange={e => update('dailyRoutine', e.target.value)} placeholder="Ejemplo: despertarse, paseos, alimentación..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="exerciseCommitment">Compromiso con ejercicio diario</Label>
          <Textarea id="exerciseCommitment" value={data.exerciseCommitment} onChange={e => update('exerciseCommitment', e.target.value)} placeholder="Tiempo que dedicarás a paseos/juegos..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="travelFrequency">Frecuencia de viajes</Label>
          <Textarea id="travelFrequency" value={data.travelFrequency} onChange={e => update('travelFrequency', e.target.value)} placeholder="Vacaciones, viajes de trabajo, estadías fuera..." className="mt-2" />
        </div>
      </div>
    </div>
  );
}
