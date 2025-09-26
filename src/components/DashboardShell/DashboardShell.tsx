"use client";

import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { ShelterSidebar } from "@/components/sidebar/ShelterSidebar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/auth');
    }
  }, [user, isInitialized, router]);

  if (!isInitialized) {
    return null
  }

  return (
    <div className="flex min-h-screen px-4 bg-gray-50">
      <aside>
        {user?.userType === 'User' && <Sidebar user={user} />}
        {user?.userType === 'Shelter' && <ShelterSidebar user={user} />}
        {user?.siteAdmin === true && <AdminSidebar user={user} />}
      </aside>
      <main className="flex-1 bg-gray-50 ml-64">{children}</main>
    </div>
  );
}
