"use client";

import { useState } from "react";
import {
  Heart,
  CreditCard,
  PawPrint,
  MapPin,
  Shield,
  Check,
  AlertCircle,
  Phone,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { donationsService } from "@/services/donations/donationsService";
import { useShelter } from "@/context/ShelterContext";
import { useUser } from "@/context/UserContext";


export default function DonationForm() {
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const {shelters} = useShelter();
  const {user} = useUser();
  const [selectedShelter, setSelectedShelter] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100, 250];
  const selectedShelterData = shelters.find((s) => s.id === selectedShelter);


  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 1) {
      toast.error("Por favor selecciona un monto válido");
      return;
    }
    if (!selectedShelter) {
      toast.error("Debes elegir un refugio");
      return;
    }

    setLoading(true);
    try {
      const data = await donationsService.createDonation({
        amount: parseFloat(amount),
        message,
        userID: user?.id || "",
        shelterID: selectedShelter,
      });

      if (data?.sessionId) {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
        );
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        toast.error("Error creando la sesión de pago");
      }
    } catch (err) {
      console.error(err);
      toast.error("Hubo un problema, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && selectedShelter;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 bg-clip-text text-transparent">
              Dona con Amor
            </h1>
            <Heart className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
            Cada donación hace la diferencia en la vida de una mascota 🐾
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario Principal */}
          <div className="lg:col-span-2 relative">
            <Card className="shadow-lg border-0 relative">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span>Formulario de Donación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <form onSubmit={handleSubmit} className="space-y-6 relative">
                  {/* Refugio */}
                  <div className="space-y-3">
                    <Label className="text-base">Refugio destinatario</Label>
                    <Select
                      value={selectedShelter}
                      onValueChange={setSelectedShelter}
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Selecciona un refugio para apoyar" />
                      </SelectTrigger>
                      <SelectContent>
                        {shelters.map((shelter) => (
                          <SelectItem key={shelter.id} value={shelter.id || ""}>
                            <div className="flex flex-col max-w-sm">
                              <span className="font-medium">
                                {shelter.name}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Info refugio */}
                  {selectedShelterData && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                      <h4 className="font-semibold text-blue-900 text-lg flex items-center gap-2">
                        Refugio{" "}
                        <span className="text-green-600">
                          {selectedShelterData.name}
                        </span>
                        {selectedShelterData.isVerified && (
                          <Badge className="bg-green-100 text-green-700 border border-green-300 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verificado
                          </Badge>
                        )}
                      </h4>

                      {(selectedShelterData.city ||
                        selectedShelterData.country) && (
                        <div className="flex items-center text-sm text-blue-800 gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {selectedShelterData.city &&
                              `${selectedShelterData.city}, `}
                            {selectedShelterData.country}
                          </span>
                        </div>
                      )}

                      {selectedShelterData.address && (
                        <div className="flex items-start text-sm text-blue-800 gap-2">
                          <Home className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="break-words">
                            {selectedShelterData.address}
                          </span>
                        </div>
                      )}

                      {selectedShelterData.phoneNumber && (
                        <div className="flex items-center text-sm text-blue-800 gap-2">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{selectedShelterData.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cantidad */}
                  <div className="space-y-3">
                    <Label className="text-base">
                      Monto de la donación (USD)
                    </Label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {predefinedAmounts.map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={
                            amount === value.toString() ? "default" : "outline"
                          }
                          onClick={() => handleAmountSelect(value)}
                          className={
                            amount === value.toString()
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : ""
                          }
                        >
                          ${value}
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      placeholder="Ingresa un monto personalizado"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="1"
                      className="text-lg h-12"
                    />
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-2">
                    <Label className="text-base">
                      Mensaje para el refugio (opcional)
                    </Label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe un mensaje de apoyo..."
                      rows={3}
                      className="resize-none"
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 text-right">
                      {message.length}/500 caracteres
                    </p>
                  </div>

                  {/* Botón Donar */}
                  <Button
                    type="submit"
                    disabled={!isFormValid || loading}
                    className="w-full h-14 text-lg font-semibold 
                               bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 
                               hover:from-emerald-600 hover:to-green-700 
                               text-white rounded-2xl shadow-lg 
                               transition-all duration-300 ease-out
                               hover:scale-[1.02] active:scale-[0.98]
                               disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed
                               relative"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="font-medium">Procesando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <CreditCard className="w-6 h-6" />
                        <span>Donar Ahora</span>
                      </div>
                    )}
                  </Button>

                  {/* Overlay mientras se procesa */}
                  {loading && (
                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl z-50">
                      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <p className="mt-3 text-emerald-700 font-semibold">
                        Procesando pago...
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Resumen</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Monto:</span>
                  <span className="text-xl font-semibold">
                    {amount ? `$${parseFloat(amount).toFixed(2)}` : "$0.00"}
                  </span>
                </div>

                <Separator />

                <div>
                  <span className="text-gray-600 text-sm">
                    Refugio seleccionado:
                  </span>
                  {selectedShelterData ? (
                    <div className="p-2 bg-gray-50 rounded-lg mt-2">
                      <h4 className="font-medium text-gray-900">
                        {selectedShelterData.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {selectedShelterData.country ||
                          "Ubicación no disponible"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-sm">
                      Ningún refugio seleccionado
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>100% va directamente al refugio</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Shield className="w-4 h-4" />
                    <span>Pago seguro con Stripe</span>
                  </div>
                </div>

                {!isFormValid && (
                  <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-amber-800">
                      <p>Para continuar necesitas:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {!amount && <li>Ingresar una cantidad</li>}
                        {!selectedShelter && <li>Seleccionar un refugio</li>}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
