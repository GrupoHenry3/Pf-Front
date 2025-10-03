"use client";

import { Heart, Search, Calendar, Users, Gift, Clock, Eye, MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/utils/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/context/UserContext';
import { useDonation } from '@/context/DonationContext';
import { ErrorAlert } from '@/components/ui/ErrorAlert';
import { useRouter } from 'next/navigation';
import { usePet } from '@/context/PetContext';
import { Shelter } from '@/interfaces/Shelter';
import { Pet } from '@/interfaces/Pet';



interface AdoptionApplication {
  id: string;
  status: string;
  statusLabel: string;
  appliedDate: string;
  nextStep: string;
  pet: Pet;
  shelter: Shelter;
}


function AdopterDashboard() {

  const {
    user,
    isProfileLoaded,
    isUserLoading,
    isInitialized,
    error,
    clearError
  } = useUser();

  const { petsToAdopt, allPets } = usePet();
  const { userDonations } = useDonation();



  const router = useRouter();

  const handleViewCatalog = () => {
    router.push("/dashboard/pet-catalog");
  }

  const handleViewDonations = () => {
    router.push("/dashboard/donation");
  }


  const handleViewProfile = () => {
    router.push("/dashboard/user/profile");
  }

  // Calcular estadísticas del usuario
  const userStats = {
    totalAdoptions: user?.adoptions?.length || 0,
    totalDonations: userDonations.length,
    totalDonationAmount: userDonations.reduce((sum, donation) => sum + donation.amount, 0),
    favoritePets: user?.favoritePets?.length || 0,
    daysOnPlatform: user ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0
  };

  // Obtener mascotas recientes (últimas 4)
  const recentPets = allPets.slice(0, 4);

  // Obtener donaciones recientes (últimas 4)
  const recentDonations = userDonations.slice(0, 4);

  // Consejos dinámicos basados en la actividad del usuario
  const getPersonalizedTip = () => {
    if (userStats.totalAdoptions === 0) {
      return {
        title: "💡 Primer paso",
        content: "¡Explora nuestro catálogo de mascotas! Tenemos muchos compañeros esperando un hogar lleno de amor.",
        action: "Explorar Mascotas"
      };
    } else if (userStats.totalDonations === 0) {
      return {
        title: "💝 Ayuda a los refugios",
        content: "Considera hacer una donación para ayudar a los refugios a cuidar mejor de las mascotas.",
        action: "Hacer Donación"
      };
    } else {
      return {
        title: "🌟 ¡Gracias por tu apoyo!",
        content: "Tu compromiso con la adopción responsable está marcando la diferencia en la vida de muchas mascotas.",
        action: "Ver Perfil"
      };
    }
  };

  const personalizedTip = getPersonalizedTip();

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
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <ErrorAlert error={error} onClear={clearError} />
          )}

          <div className="mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              ¡Hola, {user!.fullName || 'Usuario'}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Te ayudamos a encontrar a tu compañero perfecto
            </p>
            {user!.email && (
              <p className="text-sm text-gray-500 mt-1">
                Conectado como: {user!.email}
              </p>
            )}
          </div>
          {/* Estadísticas del usuario */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Adopciones</h3>
                    <p className="text-2xl font-bold text-blue-600">{userStats.totalAdoptions}</p>
                    <p className="text-sm text-gray-500">Solicitudes realizadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Donaciones</h3>
                    <p className="text-2xl font-bold text-green-600">{userStats.totalDonations}</p>
                    <p className="text-sm text-gray-500">${userStats.totalDonationAmount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Miembro desde</h3>
                    <p className="text-2xl font-bold text-orange-600">{userStats.daysOnPlatform}</p>
                    <p className="text-sm text-gray-500">días en la plataforma</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acciones rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6" onClick={handleViewCatalog}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Buscar Mascotas</h3>
                    <p className="text-sm text-gray-500">{petsToAdopt.length} disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6" onClick={handleViewDonations}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Hacer Donación</h3>
                    <p className="text-sm text-gray-500">Ayuda a los refugios</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6" onClick={handleViewProfile}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Mi Perfil</h3>
                    <p className="text-sm text-gray-500">Actualizar información</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-0 shadow-md">
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
                              src={app.pet.avatarURL}
                              alt={app.pet.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-lg text-gray-900">{app.pet.name}</h4>
                                <Badge
                                  variant={app.status === 'approved' ? 'default' : 'secondary'}
                                  className={
                                    app.status === 'approved'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-orange-100 text-orange-800'
                                  }
                                >
                                  {app.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{app.shelter.name}</p>
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
                          onClick={() => router.push('/dashboard/pet-catalog')}
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

              {/* Mis Donaciones */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    <span>Mis Donaciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userDonations && userDonations.length > 0 ? (
                    <div className="space-y-4">
                      {userDonations.map((donation) => (
                        <div
                          key={donation.id}
                          className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Gift className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-lg text-gray-900">${donation.amount.toLocaleString()}</h4>
                              <Badge
                                variant={donation.status === 'completed' ? 'default' : 'secondary'}
                                className={
                                  donation.status === 'completed'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {donation.status === 'completed' ? 'Completada' : 'Fallida'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(donation.createdAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            {donation.message && (
                              <p className="text-sm text-gray-500 mt-2 italic">
                                &ldquo;{donation.message}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total donado:</span>
                          <span className="text-lg font-bold text-green-600">
                            ${userStats.totalDonationAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg text-gray-900 mb-2">No has realizado donaciones</h3>
                      <p className="text-gray-500 mb-4">
                        Tus donaciones ayudan a los refugios a cuidar mejor de las mascotas
                      </p>
                      <Button
                        onClick={handleViewDonations}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Hacer mi primera donación
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {/* Consejo personalizado */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="text-green-800">{personalizedTip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-4">
                    {personalizedTip.content}
                  </p>
                  <Button
                    size="sm"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => {
                      if (personalizedTip.action === "Explorar Mascotas") handleViewCatalog();
                      else if (personalizedTip.action === "Hacer Donación") handleViewDonations();
                      else handleViewProfile();
                    }}
                  >
                    {personalizedTip.action}
                  </Button>
                </CardContent>
              </Card>

              {/* Mascotas recientes */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Mascotas agregadas Recientemente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentPets.length > 0 ? (
                    <div className="space-y-3">
                      {recentPets.map((pet) => (
                        <div key={pet.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                             onClick={() => router.push(`/dashboard/pet-detail/${pet.id}`)}>
                          <ImageWithFallback
                            src={pet.avatarURL}
                            alt={pet.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{pet.name}</p>
                            <p className="text-xs text-gray-500">{pet.species?.name} • {pet.breed?.name}</p>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3"
                        onClick={handleViewCatalog}
                      >
                        Ver todas las mascotas
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Eye className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No hay mascotas recientes</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Donaciones recientes */}
              {recentDonations.length > 0 && (
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Gift className="w-5 h-5 text-green-600" />
                      <span>Donaciones Recientes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentDonations.reverse().map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">${donation.amount.toLocaleString()}</p>
                          </div>
                          <Badge
                            variant={donation.status === 'completed' ? 'default' : 'secondary'}
                            className={donation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          >
                            {donation.status === 'completed' ? 'Completada' : 'Fallida'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información del perfil */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Mi Información</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {user?.city && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.city}, {user.country}</span>
                      </div>
                    )}
                    {user?.phoneNumber && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user?.email}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={handleViewProfile}
                    >
                      Actualizar perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
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
