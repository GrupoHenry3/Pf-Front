"use client";

import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isUserLoading, isInitialized } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized || isUserLoading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    // 🔹 Redirecciones según rol
    if (user.siteAdmin) {
      if (!pathname.startsWith("/dashboard/admin")) {
        router.replace("/dashboard/admin");
      }
      return;
    }

    if (user.userType === "Shelter") {
      if (!pathname.startsWith("/dashboard/shelter")) {
        router.replace("/dashboard/shelter");
      }
      return;
    }

    if (user.userType === "User") {
      if (!pathname.startsWith("/dashboard/user")) {
        router.replace("/dashboard/user");
      }
      return;
    }
  }, [user, isUserLoading, isInitialized, router, pathname]);

  if (!isInitialized || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
