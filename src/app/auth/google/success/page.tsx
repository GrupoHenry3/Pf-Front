"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      try {
        console.log("🚀 Página de éxito de Google iniciada");
        
        // Capturar el token de la URL
        const token = searchParams.get('token');
        
        if (token) {
          console.log("🎫 Token capturado de la URL:", token);
          
          // Guardar el token en localStorage
          localStorage.setItem('access_token', token);
          console.log("✅ Token guardado en localStorage");
          
          // Mostrar mensaje de éxito
          toast.success("¡Autenticación con Google exitosa!");
          
          // Esperar un momento para que el usuario vea el mensaje
          setTimeout(() => {
            // Redirigir al dashboard
            console.log("🔄 Redirigiendo al dashboard...");
            router.push("/dashboard");
          }, 1500);
        } else {
          console.log("❌ No se encontró token en la URL");
          toast.error("Error: No se recibió el token de autenticación");
          router.push("/auth?error=no_token");
        }
      } catch (error) {
        console.error("❌ Error en el procesamiento del token:", error);
        toast.error("Error al procesar la autenticación");
        router.push("/auth?error=processing_failed");
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleSuccess();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {isProcessing ? "Procesando autenticación..." : "Redirigiendo..."}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ¡Casi listo! Te estamos llevando al dashboard.
        </p>
      </div>
    </div>
  );
}
