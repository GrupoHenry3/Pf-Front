import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { useState } from "react";

interface StepProps {
  data: any;
  update: (field: string, value: string) => void;
}

export function StepHousing({ data, update }: StepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    let error = "";
    if (field === "housingType") {
      if (!["house", "apartment", "farm"].includes(value)) error = "Seleccione un tipo de vivienda válido";
    }
    if (field === "housingOwnership") {
      if (!["own", "rent"].includes(value)) error = "Seleccione propiedad válida";
    }
    if (field === "livingSpace") {
      if (!value.trim()) error = "Describe el espacio donde vivirá la mascota";
      else if (value.trim().length < 30) error = "Debe tener al menos 30 caracteres";
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-gray-900 mb-2">Condiciones del hogar</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Tipo de vivienda *</Label>
          <RadioGroup
            value={data.housingType}
            onValueChange={v => {
              update("housingType", v);
              validateField("housingType", v);
            }}
            className="mt-2 grid grid-cols-2 gap-4"
          >
            {["house", "apartment", "farm"].map(type => (
              <div
                key={type}
                className="flex items-center space-x-2 border border-gray-200 rounded-lg p-3 hover:border-green-500 transition-colors"
              >
                <RadioGroupItem value={type} id={type} />
                <Label htmlFor={type} className="cursor-pointer">
                  {type === "house" && "🏠 Casa"}
                  {type === "apartment" && "🏢 Apartamento"}
                  {type === "farm" && "🚜 Finca/Campo"}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.housingType && <p className="text-red-600 text-sm mt-1">{errors.housingType}</p>}
        </div>

        <div>
          <Label>Propiedad de la vivienda *</Label>
          <RadioGroup
            value={data.housingOwnership}
            onValueChange={v => {
              update("housingOwnership", v);
              validateField("housingOwnership", v);
            }}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="own" id="own" />
              <Label htmlFor="own">Propia</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent">Alquilada (con permiso para mascotas)</Label>
            </div>
          </RadioGroup>
          {errors.housingOwnership && <p className="text-red-600 text-sm mt-1">{errors.housingOwnership}</p>}
        </div>

        <div>
          <Label>Espacio exterior</Label>
          <RadioGroup
            value={data.yardSize}
            onValueChange={v => update("yardSize", v)}
            className="mt-2"
          >
            {["none", "small", "medium", "large"].map(size => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={size} />
                <Label htmlFor={size}>
                  {size === "none" && "Sin jardín/patio"}
                  {size === "small" && "Patio/jardín pequeño"}
                  {size === "medium" && "Jardín mediano"}
                  {size === "large" && "Jardín grande/amplio espacio"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="livingSpace">Describe el espacio donde vivirá la mascota *</Label>
          <Textarea
            id="livingSpace"
            value={data.livingSpace}
            onChange={e => update("livingSpace", e.target.value)}
            onBlur={e => validateField("livingSpace", e.target.value)}
            placeholder="Tamaño aproximado, áreas disponibles, seguridad, etc."
            className="mt-2"
          />
          {errors.livingSpace && <p className="text-red-600 text-sm mt-1">{errors.livingSpace}</p>}
        </div>
      </div>
    </div>
  );
}
