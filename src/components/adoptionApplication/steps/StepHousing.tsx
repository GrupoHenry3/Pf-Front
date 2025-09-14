import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";

interface StepProps {
  data: any;
  update: (field: string, value: string) => void;
}

export function StepHousing({ data, update }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Condiciones del hogar</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Tipo de vivienda *</Label>
          <RadioGroup value={data.housingType} onValueChange={v => update('housingType', v)} className="mt-2 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
              <RadioGroupItem value="house" id="house" />
              <Label htmlFor="house" className="cursor-pointer">🏠 Casa</Label>
            </div>
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
              <RadioGroupItem value="apartment" id="apartment" />
              <Label htmlFor="apartment" className="cursor-pointer">🏢 Apartamento</Label>
            </div>
            <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors">
              <RadioGroupItem value="farm" id="farm" />
              <Label htmlFor="farm" className="cursor-pointer">🚜 Finca/Campo</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Propiedad de la vivienda *</Label>
          <RadioGroup value={data.housingOwnership} onValueChange={v => update('housingOwnership', v)} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="own" id="own" />
              <Label htmlFor="own">Propia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent">Alquilada (con permiso para mascotas)</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>Espacio exterior</Label>
          <RadioGroup value={data.yardSize} onValueChange={v => update('yardSize', v)} className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none">Sin jardín/patio</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">Patio/jardín pequeño</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Jardín mediano</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Jardín grande/amplio espacio</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="livingSpace">Describe el espacio donde vivirá la mascota *</Label>
          <Textarea id="livingSpace" value={data.livingSpace} onChange={e => update('livingSpace', e.target.value)} placeholder="Tamaño aproximado, áreas disponibles, seguridad, etc." className="mt-2" />
        </div>
      </div>
    </div>
  );
}
