"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Search,
  Heart,
  MessageCircle,
  LogOut,
  User,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { ShelterSidebar } from "./ShelterSidebar";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

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
  const { logout } = useAuth();

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
      { id: "donations", label: "Hacer Donación", icon: Heart, badge: null },
    ];

    if (!user) {
      return [{ id: "catalog", label: "Ver Mascotas", icon: Search, badge: null }, ...commonItems];
    }

    return [
      { id: "adopter-dashboard", label: "Dashboard", icon: Home, badge: null },
      { id: "catalog", label: "Buscar Mascotas", icon: Search, badge: null },
      { id: "my-applications", label: "Mis Solicitudes", icon: FileText, badge: null },
      ...commonItems,
      { id: "shelter-mode", label: "Modo Refugio", icon: Building2, badge: null },
      { id: "profile", label: "Mi Perfil", icon: User, badge: null },
    ];
  };

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
          { id: "my-applications", label: "Solicitudes", icon: FileText, badge: null },
          { id: "messages", label: "Mensajes", icon: MessageCircle, badge: 3 },
          { id: "donation-flow", label: "Donar", icon: Heart, badge: null },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  const quickAccessItems = getQuickAccessItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200"><div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">PetAdopt</h1>
            <p className="text-sm text-gray-700">Encuentra tu compañero</p>
          </div>
        </div>
      </div>{user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              {user.avatarURL ? (
              <div className="w-10 h-10">
                <Image src={user.avatarURL || '/default-avatar.png'} alt={user.fullName || 'Default Avatar'} width={40} height={40} />
              </div>
              ) : (
                <AvatarFallback className="bg-green-500 text-white">
                  {user.fullName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-lg text-gray-900 truncate">{user.fullName}</p>
              <Badge variant="outline" className="text-sm text-gray-700 truncate">
                {user.userType === "User" && "Adoptante"}
              </Badge>
            </div>
          </div>
        </div>
      )}<div className="flex-1 overflow-y-auto overflow-x-hidden">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant= "ghost"
              className= "w-full justify-start text-gray-700 hover:bg-accent hover:text-black-500"
              onClick={() => {
                if (item.id === "shelter-mode") {
                  router.push("/dashboard/user/shelter-registration");
                  setIsOpen(false);
                } else if (item.id === "profile") {
                  router.push("/dashboard/user/profile");
                  setIsOpen(false);
                } else if (item.id === "my-applications") {
                  router.push("/dashboard/user/applications");
                  setIsOpen(false);
                } else if (item.id === "catalog") {
                  router.push("/dashboard/pet-catalog");
                  setIsOpen(false);
                } else if (item.id === "adopter-dashboard") {
                  router.push("/dashboard/user");
                  setIsOpen(false);
                } else if (item.id === "donations") {
                  router.push("/dashboard/user/donations");
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
      </div><div className="p-4 border-t border-gray-200">
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-500"
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
    <><div className="hidden lg:block w-80 h-screen fixed left-0 top-0 z-40 ">
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
              onClick={() => {
                if (item.id === "adopter-dashboard") {
                  router.push("/dashboard/user");
                } else if (item.id === "catalog") {
                  router.push("/dashboard/pet-catalog");
                } else if (item.id === "my-applications") {
                  router.push("/dashboard/user/applications");
                }else if (item.id === "donations") {
                  router.push("/dashboard/user/donations");
                }
                setIsOpen(false);
              }}
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
