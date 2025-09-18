"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  Plus,
  FileText,
  DollarSign,
  Bell,
  HelpCircle,
  Building2,
  Users,
  BarChart3,
  Calendar,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from "@/components/ui/sheet";
import { UserInterface } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export type ShelterCurrentView =
  | "shelter-dashboard"
  | "my-pets"
  | "add-pet"
  | "manage-applications"
  | "messages"
  | "donations"
  | "profile"
  | "analytics"
  | "volunteers"
  | "events"
  | "help"
  | "notifications"
  | "settings";

interface ShelterSidebarProps {
  user: UserInterface | null;
  embedded?: boolean; // Para usar dentro de un contenedor
}

export function ShelterSidebar({ user, embedded = false }: ShelterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useUser();

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
      { id: "shelter-dashboard", label: "Dashboard", icon: Home, badge: null },
      { id: "my-pets", label: "Mis Mascotas", icon: Heart, badge: null },
      { id: "add-pet", label: "Agregar Mascota", icon: Plus, badge: null },
      { id: "manage-applications", label: "Solicitudes", icon: FileText, badge: 5 },
      { id: "messages", label: "Mensajes", icon: MessageCircle, badge: 2 },
      { id: "donations", label: "Donaciones", icon: DollarSign, badge: null },
      { id: "analytics", label: "Estadísticas", icon: BarChart3, badge: null },
      { id: "volunteers", label: "Voluntarios", icon: Users, badge: null },
      { id: "events", label: "Eventos", icon: Calendar, badge: null },
    ];
  };

  const getSupportItems = () => [
    { id: "help", label: "Ayuda", icon: HelpCircle },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const getQuickAccessItems = () => {
    return [
      { id: "shelter-dashboard", label: "Dashboard", icon: Home, badge: null },
      { id: "my-pets", label: "Mascotas", icon: Heart, badge: null },
      { id: "add-pet", label: "Agregar", icon: Plus, badge: null },
      { id: "messages", label: "Mensajes", icon: MessageCircle, badge: 2 },
    ];
  };

  const navigationItems = getNavigationItems();
  const supportItems = getSupportItems();
  const quickAccessItems = getQuickAccessItems();

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "shelter-dashboard":
        router.push("/dashboard/shelter");
        break;
      case "my-pets":
        router.push("/dashboard/shelter/pets");
        break;
      case "add-pet":
        router.push("/dashboard/shelter/add-pet");
        break;
      case "manage-applications":
        router.push("/dashboard/shelter/applications");
        break;
      case "messages":
        router.push("/dashboard/shelter/messages");
        break;
      case "donations":
        router.push("/dashboard/shelter/donations");
        break;
      case "analytics":
        router.push("/dashboard/shelter/analytics");
        break;
      case "volunteers":
        router.push("/dashboard/shelter/volunteers");
        break;
      case "events":
        router.push("/dashboard/shelter/events");
        break;
      case "profile":
        router.push("/dashboard/shelter/profile");
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">PetAdopt</h1>
            <p className="text-sm text-gray-500">Panel de Refugio</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatarURL} alt={user.fullName} />
              <AvatarFallback className="bg-green-500 text-white">
                {user.fullName?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">
                {user.shelter?.name || "Refugio"}
              </p>
              <div className="flex items-center mt-1">
                <Shield className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Refugio Verificado</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={() => handleNavigation(item.id)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto bg-orange-500 text-white">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        <Separator className="mx-4" />

        {/* Support */}
        <nav className="p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Soporte
          </p>
          {supportItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  // Si está embebido, solo mostrar el contenido
  if (embedded) {
    return <SidebarContent />;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              size="sm"
              className="bg-white shadow-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 sm:w-80">
            <SheetHeader className="sr-only">
              <SheetTitle>Menú de navegación - Refugio</SheetTitle>
              <SheetDescription>
                Panel de control para refugios de PetAdopt
              </SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Bottom Bar */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <nav className="flex items-center justify-around px-1 py-1 safe-area-pb">
          {quickAccessItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.id)}
            >
              <div className="relative">
                <item.icon />
                {item.badge && item.badge > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white min-w-3.5 h-3.5 text-xs flex items-center justify-center p-0 border border-white text-[10px] rounded-full">
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
