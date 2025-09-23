"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading, isInitialized } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isUserLoading && !user) {
      router.replace("/auth");
    }
  }, [isInitialized, isUserLoading, user, router]);

  if (!isInitialized || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
