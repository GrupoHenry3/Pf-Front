"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (token) {
      // Guardar el token en localStorage
      localStorage.setItem('access_token', token);
      
      setIsProcessing(false);
      router.replace("/dashboard");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{isProcessing ? "Procesando autenticación..." : "Redirigiendo..."}</p>
        <p className="text-sm text-gray-500 mt-2">¡Casi listo! Te estamos llevando al dashboard.</p>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}