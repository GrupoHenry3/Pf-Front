import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

interface StepProps {
  data: any;
  update: (field: string, value: string) => void;
}

export function StepFamilyPets({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Familia y otras mascotas</h2>
        <p className="text-gray-600">Información sobre el hogar y mascotas existentes</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="householdMembers">Miembros del hogar *</Label>
          <Textarea id="householdMembers" value={data.householdMembers} onChange={e => update('householdMembers', e.target.value)} placeholder="Número de personas, edades, ocupaciones..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="childrenAges">Edades de los niños (si hay)</Label>
          <Textarea id="childrenAges" value={data.childrenAges} onChange={e => update('childrenAges', e.target.value)} placeholder="Ejemplo: 5, 8, 12 años..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="currentPets">Mascotas actuales</Label>
          <Textarea id="currentPets" value={data.currentPets} onChange={e => update('currentPets', e.target.value)} placeholder="Especifica especie, raza, edad, carácter..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="petHistory">Historial con mascotas</Label>
          <Textarea id="petHistory" value={data.petHistory} onChange={e => update('petHistory', e.target.value)} placeholder="Experiencias previas, animales fallecidos, adopciones..." className="mt-2" />
        </div>

        <div>
          <Label htmlFor="additionalInfo">Información adicional</Label>
          <Textarea id="additionalInfo" value={data.additionalInfo} onChange={e => update('additionalInfo', e.target.value)} placeholder="Cualquier información relevante" className="mt-2" />
        </div>
      </div>
    </div>
  );
}
