import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input"; // Componente Input
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

interface StepProps {
  data: any;
  update: (field: string, value: string) => void;
}

export function StepMotivation({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Información básica</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="dni">DNI *</Label>
          <Input id="dni" value={data.dni} onChange={e => update('dni', e.target.value)} placeholder="Ingrese su DNI" className="mt-2" />
        </div>

        <div>
          <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
          <Input
            id="birthDate"
            type="date"
            value={data.birthDate}
            onChange={e => update('birthDate', e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="adoptionReason">Razón principal *</Label>
          <Textarea id="adoptionReason" value={data.adoptionReason} onChange={e => update('adoptionReason', e.target.value)} placeholder="Explica por qué has decidido adoptar..." className="mt-2 min-h-24" />
        </div>

        <div>
          <Label htmlFor="expectations">Expectativas *</Label>
          <Textarea id="expectations" value={data.expectations} onChange={e => update('expectations', e.target.value)} placeholder="Describe qué tipo de relación esperas..." className="mt-2" />
        </div>

        <div>
          <Label>Experiencia previa con mascotas *</Label>
          <RadioGroup value={data.petExperience} onValueChange={v => update('petExperience', v)} className="mt-2">
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
        </div>
      </div>
    </div>
  );
}
