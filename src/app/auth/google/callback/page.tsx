"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth/authService";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        await authService.handleGoogleCallback();
      } catch (error) {
        console.error("Error en callback de Google:", error);
        router.push("/auth?error=oauth_failed");
      }
    };

    handleGoogleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Procesando autenticación con Google...</p>
      </div>
    </div>
  );
}
