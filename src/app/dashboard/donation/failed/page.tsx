"use client";

import { XCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentFailed() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Pago Rechazado ❌
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Tu transacción no pudo ser procesada. Por favor, revisa tu información de pago o intenta nuevamente.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link href="/dashboard/user">
              <Home className="w-4 h-4" />
              Ir al dashboard
            </Link>
          </Button>

          <Button 
            className="bg-red-600 hover:bg-red-700 flex items-center gap-2" 
            onClick={() => router.push("/dashboard/donation")}
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar Pago
          </Button>
        </div>
      </div>
    </div>
  );
}
