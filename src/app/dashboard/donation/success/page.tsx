"use client";

import { Check, Heart,Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-green-700">
            ¡Gracias por tu donación! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-md">
            <Check className="w-12 h-12 text-green-600" />
          </div>

          <p className="text-gray-700 text-lg">
            Tu aporte nos ayuda a seguir cuidando y encontrando hogares para los animales 💕
          </p>

          {sessionId && (
            <div className="p-3 bg-gray-100 rounded-lg text-sm text-gray-600 break-all">
              <span className="font-medium">ID de transacción:</span>
              <p className="mt-1 text-gray-800">{sessionId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => router.push("/dashboard/shelter")} className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Volver al inicio
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("dashboard/user/donations")}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-500" />
              Hacer otra donación
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
