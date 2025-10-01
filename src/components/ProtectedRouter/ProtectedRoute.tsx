"use client";

import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes?: string[];
  requireSiteAdmin?: boolean; 
}

const ProtectedRoute = ({ children, allowedUserTypes, requireSiteAdmin }: ProtectedRouteProps) => {
  const { user, isUserLoading, isInitialized } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isUserLoading) {
      if (!user) {
        // Solo redirigir si no está en ninguna ruta de dashboard
        if(!pathname.includes('/dashboard/admin') && !pathname.includes('/dashboard/shelter') && !pathname.includes('/dashboard/user')){
          router.replace('/auth');
        }
      } else {
        if (requireSiteAdmin && !user.siteAdmin) {
          const redirectPath = user.userType === 'Shelter' ? '/dashboard/shelter' : '/dashboard/user';
          router.replace(redirectPath);
        }
        else if (
          allowedUserTypes &&
          !allowedUserTypes.includes(user.userType)
        ) {
          let redirectPath;
          if (user.siteAdmin) {
            redirectPath = '/dashboard/admin';
          } else {
            redirectPath = user.userType === 'Shelter' ? '/dashboard/shelter' : '/dashboard/user';
          }
          router.replace(redirectPath);
        }
      }
    }
  }, [user, isUserLoading, isInitialized, allowedUserTypes, requireSiteAdmin, router, pathname]);

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

  if (
    !user ||
    (requireSiteAdmin && !user.siteAdmin) ||
    (allowedUserTypes && !allowedUserTypes.includes(user.userType))
  ) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
