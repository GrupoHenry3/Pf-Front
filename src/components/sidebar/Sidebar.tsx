"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Search,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  Plus,
  User,
  FileText,
  DollarSign,
  Bell,
  HelpCircle,
  Building2,
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
import {  UserInterface } from "@/interfaces/User";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { ShelterSidebar } from "./ShelterSidebar";

export type CurrentView =
  | "catalog"
  | "donation-flow"
  | "auth"
  | "adopter-dashboard"
  | "shelter-dashboard"
  | "admin-dashboard"
  | "messages"
  | "profile"
  | "add-pet"
  | "manage-applications"
  | "donations"
  | "help"
  | "notifications"
  | "settings";


interface SidebarProps {
  user: UserInterface | null;
}

export function Sidebar({
  user,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useUser();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  if (user?.userType === "Shelter") {
    return <ShelterSidebar user={user} />;
  }

  const handleLogout = async () => {
    try{
      await logout();
      router.push("/auth");
    }
    catch(error){
      console.error("Error al cerrar sesión:", error);
    }
  };




  const getNavigationItems = () => {
    const commonItems = [
      { id: "donation-flow", label: "Hacer Donación", icon: Heart, badge: null },
    ];

    if (!user) {
      return [{ id: "catalog", label: "Ver Mascotas", icon: Search, badge: null }, ...commonItems];
    }

    return [
      { id: "adopter-dashboard", label: "Dashboard", icon: Home, badge: null },
      { id: "catalog", label: "Buscar Mascotas", icon: Search, badge: null },
      { id: "messages", label: "Mensajes", icon: MessageCircle, badge: 3 },
      ...commonItems,
      { id: "shelter-mode", label: "Modo Refugio", icon: Building2, badge: null },
      { id: "profile", label: "Mi Perfil", icon: User, badge: null },
    ];
  };

  const getSupportItems = () => [
    { id: "help", label: "Ayuda", icon: HelpCircle },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  const getQuickAccessItems = () => {
    if (!user) {
      return [
        { id: "catalog", label: "Mascotas", icon: Search, badge: null },
        { id: "donation-flow", label: "Donar", icon: Heart, badge: null },
      ];
    }

    switch (user.role) {
      case "adopter":
        return [
          { id: "adopter-dashboard", label: "Dashboard", icon: Home, badge: null },
          { id: "catalog", label: "Buscar", icon: Search, badge: null },
          { id: "messages", label: "Mensajes", icon: MessageCircle, badge: 3 },
          { id: "donation-flow", label: "Donar", icon: Heart, badge: null },
        ];

      case "shelter":
        return [
          { id: "shelter-dashboard", label: "Dashboard", icon: Home, badge: null },
          { id: "catalog", label: "Mascotas", icon: Heart, badge: null },
          { id: "add-pet", label: "Agregar", icon: Plus, badge: null },
          { id: "messages", label: "Mensajes", icon: MessageCircle, badge: 2 },
        ];

      case "admin":
        return [
          { id: "admin-dashboard", label: "Dashboard", icon: Home, badge: null },
          { id: "catalog", label: "Mascotas", icon: Search, badge: null },
          { id: "manage-applications", label: "Solicitudes", icon: FileText, badge: 12 },
          { id: "donations", label: "Donaciones", icon: DollarSign, badge: null },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  const supportItems = getSupportItems();
  const quickAccessItems = getQuickAccessItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200"><div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">PetAdopt</h1>
            <p className="text-sm text-gray-500">Encuentra tu compañero</p>
          </div>
        </div>
      </div>{user && (
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
                {user.role === "adopter" && "Adoptante"}
                {user.role === "shelter" && "Refugio"}
                {user.role === "admin" && "Administrador"}
              </p>
            </div>
          </div>
        </div>
      )}<div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant= "ghost"
              className= "w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={() => {
                if (item.id === "shelter-mode") {
                  router.push("/shelter-registration");
                  setIsOpen(false);
                } else {
                  setIsOpen(false);
                }
              }}
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

        <Separator className="mx-4" /><nav className="p-4 space-y-2">
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
      </div><div className="p-4 border-t border-gray-200">
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </Button>
        ) : (
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => {
              router.push("/auth");
              setIsOpen(false);
            }}
          >
            Iniciar Sesión
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <><div className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-40">
        <SidebarContent />
      </div><div className="lg:hidden fixed top-4 left-4 z-50">
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
              <SheetTitle>Menú de navegación</SheetTitle>
              <SheetDescription>
                Navegación principal de PetAdopt para acceso a todas las
                funciones
              </SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div><div
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
            >
              <div className="relative">
                <item.icon
                />
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
