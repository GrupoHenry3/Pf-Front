"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";  
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function DonationForm() {
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const predefinedAmounts = [5, 10, 20, 50, 100]; // USD

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString(), customAmount: '' }));
  };

  const handleCustomAmount = (value: string) => {
    setFormData(prev => ({ ...prev, customAmount: value, amount: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const donationAmount = formData.amount || formData.customAmount;
    if (!donationAmount) {
      toast.error('Por favor selecciona un monto');
      return;
    }

    if (parseInt(donationAmount) < 1) {
      toast.error('La donación mínima es de 1 USD');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseInt(donationAmount),
          message: formData.message,
          currency: "usd"
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
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

  const selectedAmount = formData.amount || formData.customAmount;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-[#FF9800] rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Hacer una Donación</h1>
        <p className="text-muted-foreground">
          Tu contribución ayuda a cuidar y encontrar hogares para mascotas necesitadas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Donación</CardTitle>
          <CardDescription>
            Cada dólar cuenta para dar una mejor vida a nuestras mascotas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Monto */}
            <div className="space-y-3">
              <Label>Monto de la donación (USD)</Label>
              <div className="grid grid-cols-3 gap-3">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={formData.amount === amount.toString() ? "default" : "outline"}
                    onClick={() => handleAmountSelect(amount)}
                    className="h-12"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customAmount">Otro monto</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Ingresa un monto personalizado"
                    value={formData.customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {/* Mensaje opcional */}
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Deja un mensaje de apoyo..."
                rows={3}
              />
            </div>

            {/* Resumen */}
            {selectedAmount && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex justify-between">
                    <span>Monto:</span>
                    <span className="font-semibold">${parseInt(selectedAmount).toLocaleString()} USD</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Pago seguro procesado por Stripe</span>
                </div>
              </CardContent>
            </Card>

            {/* Botón de envío */}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-[#FF9800] hover:from-primary/90 hover:to-[#FF9800]/90 text-white font-semibold py-3"
              size="lg"
              disabled={!selectedAmount || loading}
            >
              <Heart className="w-5 h-5 mr-2" />
              {loading ? "Procesando..." : `Donar $${selectedAmount}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
