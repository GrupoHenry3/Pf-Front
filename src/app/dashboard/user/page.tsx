"use client";

import { Heart, Search, MessageCircle, Calendar, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/utils/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRouter/ProtectedRoute';

interface AdopterDashboardProps {
  onViewCatalog: () => void;
  onViewMessages: () => void;
}

interface AdoptionApplication {
  id: string;
  petName: string;
  petImage: string;
  shelterName: string;
  status: string;
  statusLabel: string;
  appliedDate: string;
  nextStep: string;
}


function AdopterDashboard({ onViewCatalog, onViewMessages }: AdopterDashboardProps) {

  const { 
    user, 
    isProfileLoaded, 
    isUserLoading, 
    isInitialized, 
    error, 
    clearError 
  } = useUser();

  const recommendations = [
    {
      id: "1",
      name: "Buddy",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      breed: "Labrador",
      match: 95,
      reason: "Buddy es un perro muy activo y juguetón, perfecto para una familia con niños.",
    },
  ];


  const router = useRouter();

  const handleViewCatalog = () => {
    router.push("/pet-catalog");
  }
  
if (!isInitialized || isUserLoading || !isProfileLoaded) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando tu dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">
          {!isInitialized && "Inicializando..."}
          {isInitialized && isUserLoading && "Cargando perfil..."}
          {isInitialized && !isUserLoading && !isProfileLoaded && "Verificando autenticación..."}
        </p>
      </div>
    </div>
  );
}

if (isInitialized && isProfileLoaded && !user) {
  return null;
}
if(user && user.userType !== "User") {
  return null;
}
  return (
    <ProtectedRoute allowedUserTypes={["User"]}>
    <div className="flex min-h-screen">
      <div className="w-64 border-r bg-white shadow-sm">
        <Sidebar 
          user={user} 
        />
      </div><div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{error && (
            <ErrorAlert error={error} onClear={clearError} />
          )}
          
          <div className="mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              ¡Hola, {user!.fullName || 'Usuario'}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Te ayudamos a encontrar a tu compañero perfecto
            </p>{user!.email && (
              <p className="text-sm text-gray-500 mt-1">
                Conectado como: {user!.email}
              </p>
            )}
          </div><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6" onClick={handleViewCatalog}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Buscar Mascotas</h3>
                    <p className="text-sm text-gray-500">1,247 disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Mis Favoritos</h3>
                    <p className="text-sm text-gray-500">5 mascotas guardadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6" onClick={onViewMessages}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Mensajes</h3>
                    <p className="text-sm text-gray-500">3 conversaciones activas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-8"><Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span>Mis Solicitudes de Adopción</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>{user ? (
                    user.adoptions && user.adoptions.length > 0 ? (
                      <div className="space-y-4">
                        {(user.adoptions as AdoptionApplication[]).map((app) => (
                          <div
                            key={app.id}
                            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                          >
                            <ImageWithFallback
                              src={app.petImage}
                              alt={app.petName}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg text-gray-900">{app.petName}</h4>
                                <Badge
                                  variant={app.status === 'approved' ? 'default' : 'secondary'}
                                  className={
                                    app.status === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-orange-100 text-orange-800'
                                  }
                                >
                                  {app.statusLabel}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{app.shelterName}</p>
                              <p className="text-sm text-gray-500">{app.nextStep}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg text-gray-900 mb-2">No tienes solicitudes activas</h3>
                        <p className="text-gray-500 mb-4">
                          Cuando apliques para adoptar una mascota, aparecerán aquí
                        </p>
                        <Button
                          onClick={onViewCatalog}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          Explorar Mascotas
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg text-gray-900 mb-2">Cargando información...</h3>
                      <p className="text-gray-500">
                        Obteniendo tus solicitudes de adopción
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    <span>Recomendado para ti</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((pet) => (
                      <div
                        key={pet.id}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <ImageWithFallback
                            src={pet.image}
                            alt={pet.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h5 className="text-gray-900">{pet.name}</h5>
                            <p className="text-sm text-gray-600">{pet.breed}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {pet.match}% match
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{pet.reason}</p>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={onViewCatalog}
                  >
                    Ver más recomendaciones
                  </Button>
                </CardContent>
              </Card><Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-green-800">💡 Consejo del día</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-4">
                    Antes de adoptar, asegúrate de tener tiempo suficiente para dedicar a
                    tu nueva mascota. Los primeros días son cruciales para crear un vínculo
                    fuerte.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-200"
                  >
                    Más consejos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}

export default AdopterDashboard;

/*
 * Dashboard del Adoptante - Implementación Segura
 * 
 * Este componente implementa las siguientes medidas de seguridad:
 * 
 * 1. Validación de inicialización: Solo se renderiza cuando el contexto está completamente inicializado
 * 2. Validación de perfil cargado: Espera a que el perfil del usuario esté completamente cargado
 * 3. Validación de usuario autenticado: Solo muestra contenido si hay un usuario válido
 * 4. Acceso universal: Todos los usuarios autenticados pueden acceder (todos inician como adoptantes)
 * 5. Manejo de errores: Muestra errores del contexto de usuario de forma segura
 * 6. Estados de carga informativos: Proporciona feedback visual durante la carga
 * 
 * Estados del contexto utilizados:
 * - isInitialized: Indica si el contexto se ha inicializado
 * - isUserLoading: Indica si se está cargando el perfil del usuario
 * - isProfileLoaded: Indica si el perfil se ha cargado completamente
 * - user: Datos del usuario autenticado
 * - error: Errores del contexto de usuario
 * - clearError: Función para limpiar errores
 */
