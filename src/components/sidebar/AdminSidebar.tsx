"use client";

import { useState, useEffect } from "react";
import { Menu, Home, Building2, Heart, Users, FileText, DollarSign, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription, SheetHeader } from "@/components/ui/sheet";
import { UserInterface } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { AdminView } from "@/app/dashboard/admin/page";
import { useAuth } from "@/context/AuthContext";

export type AdminCurrentView =
  | "admin-dashboard"
  | "all-shelters"
  | "all-pets"
  | "all-users"
  | "applications"
  | "donations"
  | "analytics"
  | "reports"
  | "moderation"
  | "system-logs"
  | "help"
  | "notifications"
  | "settings";

interface AdminSidebarProps {
  user: UserInterface | null;
  embedded?: boolean;
  onViewChange?: (view: AdminView) => void;
}

export function AdminSidebar({ user, embedded = false, onViewChange }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getNavigationItems = () => {
    return [
      { id: "admin-dashboard", label: "Dashboard", icon: Home, badge: null },
      { id: "all-shelters", label: "Refugios", icon: Building2, badge: null },
      { id: "all-pets", label: "Mascotas", icon: Heart, badge: null },
      { id: "all-users", label: "Usuarios", icon: Users, badge: null },
      { id: "applications", label: "Solicitudes", icon: FileText, badge: null },
      { id: "donations", label: "Donaciones", icon: DollarSign, badge: null },
    ];
  };

  const getQuickAccessItems = () => {
    return [
      { id: "admin-dashboard", label: "Dashboard", icon: Home, badge: null },
      { id: "all-shelters", label: "Refugios", icon: Building2, badge: null },
      { id: "all-pets", label: "Mascotas", icon: Heart, badge: null },
      { id: "moderation", label: "Moderar", icon: Shield, badge: 3 },
    ];
  };

  const navigationItems = getNavigationItems();
  const quickAccessItems = getQuickAccessItems();

  const handleNavigation = (itemId: string) => {
    if (onViewChange) {
      switch (itemId) {
        case "admin-dashboard":
          onViewChange("dashboard");
          break;
        case "all-shelters":
          onViewChange("shelters");
          break;
        case "all-pets":
          onViewChange("pets");
          break;
        case "all-users":
          onViewChange("users");
          break;
        case "applications":
          onViewChange("applications");
          break;
        case "donations":
          onViewChange("donations");
          break;
        default:
          break;
      }
    } else {
      switch (itemId) {
        case "admin-dashboard":
          router.push("/dashboard/admin");
          break;
        case "all-shelters":
          router.push("/dashboard/admin/shelter");
          break;
        case "all-pets":
          router.push("/dashboard/admin/pet");
          break;
        case "all-users":
          router.push("/dashboard/admin/user");
          break;
        case "applications":
          router.push("/dashboard/admin/adoptions");
          break;
        case "donations":
          router.push("/dashboard/admin/donations");
          break;
        default:
          break;
      }
    }
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200 ">
        <div className="flex items-center space-x-3 ">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">PetAdopt</h1>
            <p className="text-sm text-gray-500">Panel de Administración</p>
          </div>
        </div>
      </div>
      {user && (
        <div className="p-4 border-b border-gray-200 ">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatarURL} alt={user.fullName} />
              <AvatarFallback className="bg-red-500 text-white">{user.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
              <div className="flex items-center mt-1">
                <Shield className="w-3 h-3 text-red-500 mr-1" />
                <span className="text-xs text-red-600 font-medium">Admin del Sitio</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button key={item.id} variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100" onClick={() => handleNavigation(item.id)}>
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
              {item.badge && item.badge > 0 && <Badge className="ml-auto bg-red-500 text-white">{item.badge}</Badge>}
            </Button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  if (embedded) {
    return <SidebarContent />;
  }

  return (
    <>
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="bg-white shadow-lg border border-gray-200 hover:bg-gray-50 text-gray-700" aria-label="Abrir menú de navegación">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 sm:w-80">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación - Administrador</SheetTitle>
              <SheetDescription>Panel de control administrativo de PetAdopt</SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ${isOpen ? "translate-y-full" : "translate-y-0"}`}>
        <nav className="flex items-center justify-around px-1 py-1 safe-area-pb ">
          {quickAccessItems.map((item) => (
            <Button key={item.id} variant="ghost" size="sm" onClick={() => handleNavigation(item.id)}>
              <div className="relative">
                <item.icon />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 bg-red-500 text-white min-w-3.5 h-3.5 text-xs flex items-center justify-center p-0 border border-white text-[10px] rounded-full">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs truncate max-w-full">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}
