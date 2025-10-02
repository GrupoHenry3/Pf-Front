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
    if (isInitialized && !isUserLoading && !user) {
      router.replace('/auth');
    }
  }, [user, isInitialized, isUserLoading, router]);

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

  if (!user) {
    return null;
  }

  const renderSidebar = () => {
    if (user.siteAdmin === true) {
      return <AdminSidebar user={user} />;
    } else if (user.userType === 'Shelter') {
      return <ShelterSidebar user={user} />;
    } else if (user.userType === 'User') {
      return <Sidebar user={user} />;
    }
    return null;
  };

  return (
    <div className="flex min-h-screen px-4 bg-gray-50">
      <aside>
        {renderSidebar()}
      </aside>
      <main className="flex-1 bg-gray-50 ml-64">{children}</main>
    </div>
  );
}
