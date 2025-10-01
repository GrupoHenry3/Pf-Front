"use client";

import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { ShelterSidebar } from "@/components/sidebar/ShelterSidebar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useUser } from "@/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";


export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized && !isUserLoading) {
      if (!user) {
        router.replace('/auth');
        return;
      }

      const currentPath = pathname.toLowerCase();
      
      if (user.siteAdmin && !currentPath.includes('/admin')) {
        router.replace('/dashboard/admin');
        return;
      }

      if (user.userType === 'Shelter' && !currentPath.includes('/shelter')) {
        router.replace('/dashboard/shelter');
        return;
      }
      const allowedUserRoutes = ['/user', '/pet-catalog', '/pet-detail', '/donation'];
      const isAllowedRoute = allowedUserRoutes.some(route => currentPath.includes(route));
      
      if (user.userType === 'User' && !isAllowedRoute) {
        router.replace('/dashboard/user');
        return;
      }
    }
  }, [user, isInitialized, isUserLoading, router, pathname]);

  if (!isInitialized || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no hay usuario
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen px-4 bg-gray-50">
      <aside>
        {user.userType === 'User' && <Sidebar user={user} />}
        {user.userType === 'Shelter' && <ShelterSidebar user={user} />}
        {user.siteAdmin === true && <AdminSidebar user={user} />}
      </aside>
      <main className="flex-1 bg-gray-50 ml-64">{children}</main>
    </div>
  );
}
