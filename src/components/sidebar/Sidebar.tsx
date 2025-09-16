'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 🚨 Necesario para redirección
import {
  Menu,
  Home,
  Search,
  Heart,
  MessageCircle,
  Settings,
  User,
  LogOut,
  Plus,
  FileText,
  DollarSign,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetHeader,
} from '@/components/ui/sheet';

type Role = 'adopter' | 'shelter' | 'admin';
export type CurrentView =
  | 'catalog'
  | 'donation-flow'
  | 'auth'
  | 'adopter-dashboard'
  | 'shelter-dashboard'
  | 'admin-dashboard'
  | 'messages'
  | 'profile'
  | 'add-pet'
  | 'manage-applications'
  | 'donations'
  | 'help'
  | 'notifications'
  | 'settings';

export interface UserType {
  name: string;
  avatar?: string;
  role: Role;
  verified?: boolean;
}

interface SidebarProps {
  user: UserType | null;
  currentView: CurrentView;
  onLogout: () => void;
}

// 🔁 Mapea IDs de vista a rutas reales
const getRoutePath = (view: CurrentView): string => {
  switch (view) {
    case 'catalog':
      return '/pet-catalog'; // 📝 Cambia por la ruta de tu catálogo
    case 'donation-flow':
      return '/donate'; // 📝 Ruta del flujo de donación
    case 'auth':
      return '/login'; // 📝 Ruta de login
    case 'adopter-dashboard':
      return '/dashboard/adopter'; // 📝 Ruta dashboard adoptante
    case 'shelter-dashboard':
      return '/dashboard/shelter'; // 📝 Ruta dashboard refugio
    case 'admin-dashboard':
      return '/dashboard/admin'; // 📝 Ruta dashboard admin
    case 'messages':
      return '/messages';
    case 'profile':
      return '/profile';
    case 'add-pet':
      return '/pets/add';
    case 'manage-applications':
      return '/applications';
    case 'donations':
      return '/donations';
    case 'help':
      return '/help';
    case 'notifications':
      return '/notifications';
    case 'settings':
      return '/settings';
    default:
      return '/';
  }
};

export function Sidebar({
  user,
  currentView,
  onLogout,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // 🚨 Para redirección

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [currentView]);

  const getNavigationItems = () => {
    const commonItems = [
      { id: 'donation-flow', label: 'Hacer Donación', icon: Heart, badge: null },
    ];

    if (!user) {
      return [{ id: 'catalog', label: 'Ver Mascotas', icon: Search, badge: null }, ...commonItems];
    }

    switch (user.role) {
      case 'adopter':
        return [
          { id: 'adopter-dashboard', label: 'Dashboard', icon: Home, badge: null },
          { id: 'catalog', label: 'Buscar Mascotas', icon: Search, badge: null },
          { id: 'messages', label: 'Mensajes', icon: MessageCircle, badge: 3 },
          ...commonItems,
          { id: 'profile', label: 'Mi Perfil', icon: User, badge: null },
        ];
      case 'shelter':
        return [
          { id: 'shelter-dashboard', label: 'Dashboard', icon: Home, badge: null },
          { id: 'catalog', label: 'Mis Mascotas', icon: Heart, badge: null },
          { id: 'add-pet', label: 'Agregar Mascota', icon: Plus, badge: null },
          { id: 'manage-applications', label: 'Solicitudes', icon: FileText, badge: 5 },
          { id: 'messages', label: 'Mensajes', icon: MessageCircle, badge: 2 },
          { id: 'donations', label: 'Donaciones Recibidas', icon: DollarSign, badge: null },
          { id: 'profile', label: 'Mi Perfil', icon: User, badge: null },
        ];
      case 'admin':
        return [
          { id: 'admin-dashboard', label: 'Dashboard', icon: Home, badge: null },
          { id: 'catalog', label: 'Mascotas', icon: Search, badge: null },
          { id: 'manage-applications', label: 'Solicitudes', icon: FileText, badge: 12 },
          { id: 'donations', label: 'Donaciones Sistema', icon: DollarSign, badge: null },
          ...commonItems,
          { id: 'profile', label: 'Mi Perfil', icon: User, badge: null },
        ];
      default:
        return [];
    }
  };

  const getSupportItems = () => [
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const navigationItems = getNavigationItems();
  const supportItems = getSupportItems();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-gray-900">PetAdopt</h1>
            <p className="text-sm text-gray-500">Encuentra tu compañero</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-green-500 text-white">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {user.role === 'adopter' && 'Adoptante'}
                {user.role === 'shelter' && 'Refugio'}
                {user.role === 'admin' && 'Administrador'}
              </p>
            </div>
            {user.verified && <Shield className="w-4 h-4 text-green-500" />}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                currentView === item.id
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => {
                router.push(getRoutePath(item.id as CurrentView)); // 🚀 Aquí redireccionas
                setIsOpen(false);
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
              {item.badge && item.badge > 0 && (
                <Badge className="ml-auto bg-orange-500 text-white">{item.badge}</Badge>
              )}
            </Button>
          ))}
        </nav>

        <Separator className="mx-4" />

        {/* Support */}
        <nav className="p-4 space-y-2">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Soporte</p>
          {supportItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={() => {
                router.push(getRoutePath(item.id as CurrentView));
                setIsOpen(false);
              }}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50"
            onClick={() => router.push("/")}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </Button>
        ) : (
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => router.push("/auth")}
          >
            Iniciar Sesión
          </Button>
        )}
      </div>
    </div>
  );

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
              <SheetTitle>Menú de navegación</SheetTitle>
              <SheetDescription>
                Navegación principal de PetAdopt para acceso a todas las funciones
              </SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
