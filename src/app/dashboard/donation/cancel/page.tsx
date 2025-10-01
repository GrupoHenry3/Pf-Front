"use client";

import { ArrowLeft, Heart, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";

interface PaymentFailureData {
  message: string;
  donation: {
    id: string;
    amount: number;
    shelterName: string;
  };
}

export default function CancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentFailureData, setPaymentFailureData] = useState<PaymentFailureData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handlePaymentFailure = async () => {
      if (sessionId) {
        try {
          setIsLoading(true);
          
          // Llamar al endpoint para manejar el fallo de pago
          const response = await apiClient.post('/donations/payment-failed', {
            sessionId: sessionId,
            errorReason: 'Pago cancelado o fallido'
          });
          
          setPaymentFailureData(response.data);
          
        } catch (error: unknown) {
          console.error("Error handling payment failure:", error);
          let errorMessage = 'Error al procesar el fallo de pago';
          
          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as { response?: { data?: { message?: string } } };
            errorMessage = axiosError.response?.data?.message || errorMessage;
          }
          
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    handlePaymentFailure();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando información del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-red-600">
            Pago no procesado ❌
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-md">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>

          {paymentFailureData ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                <h3 className="font-semibold text-red-800 mb-2">Detalles del error:</h3>
                <div className="space-y-2 text-sm text-red-700">
                  <p><strong>Monto:</strong> ${paymentFailureData.donation.amount}</p>
                  <p><strong>Refugio:</strong> {paymentFailureData.donation.shelterName}</p>
                  <p><strong>Motivo:</strong> Pago cancelado o fallido</p>
                  <p><strong>ID de donación:</strong> {paymentFailureData.donation.id}</p>
                </div>
              </div>

              <p className="text-gray-700 text-lg">
                Tu donación no pudo ser procesada. Hemos enviado un email con los detalles del error.
              </p>
            </>
          ) : error ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
              <p className="text-gray-700 text-lg">
                Hubo un problema al procesar la información del pago.
              </p>
            </>
          ) : (
            <p className="text-gray-700 text-lg">
              Parece que decidiste no continuar. No pasa nada, puedes intentarlo de nuevo cuando quieras 🙌
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => router.push("/dashboard/donation")}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
            >
              <Heart className="w-4 h-4 text-white" />
              Volver a intentar
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/user")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Ir al dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
