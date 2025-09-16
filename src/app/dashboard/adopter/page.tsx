"use client";

import { Heart, Search, MessageCircle, Calendar, MapPin, Star } from 'lucide-react';
import { User } from '@/interfaces/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageWithFallback } from '@/components/utils/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { Sidebar, type CurrentView } from '@/components/sidebar/Sidebar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const userExample: User = {
  id: '123',
  name: 'Juan Pérez',
  email: 'correo@correo.com',
  role: 'adopter'
};

function AdopterDashboard() {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<CurrentView>('adopter-dashboard');
  const onViewCatalog = () => router.push('/pet-catalog');
  const onViewMessages = () => setCurrentView('messages');
  const handleLogout = () => console.log('Logout');
  const recentlyViewed = [
    {
      id: '1',
      name: 'Luna',
      type: 'dog',
      breed: 'Golden Retriever',
      age: 2,
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
      location: 'Madrid, España',
      shelterName: 'Refugio San Francisco'
    },
    {
      id: '2',
      name: 'Milo',
      type: 'cat',
      breed: 'Maine Coon',
      age: 1,
      image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop',
      location: 'Barcelona, España',
      shelterName: 'Gatitos Felices'
    }
  ];

  const applications = [
    {
      id: '1',
      petName: 'Bella',
      petImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop',
      shelterName: 'Refugio La Esperanza',
      status: 'pending',
      statusLabel: 'En revisión',
      appliedDate: '2024-03-15',
      nextStep: 'Entrevista programada para el 20 de marzo'
    },
    {
      id: '2',
      petName: 'Max',
      petImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop',
      shelterName: 'Amigos Peludos',
      status: 'approved',
      statusLabel: 'Aprobada',
      appliedDate: '2024-03-10',
      nextStep: 'Contactar para coordinar la entrega'
    }
  ];

  const recommendations = [
    {
      id: '3',
      name: 'Rocky',
      type: 'dog',
      breed: 'Labrador Mix',
      age: 3,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
      match: 95,
      reason: 'Ideal para familias con niños'
    },
    {
      id: '4',
      name: 'Whiskers',
      type: 'cat',
      breed: 'Siamese',
      age: 2,
      image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=300&h=300&fit=crop',
      match: 88,
      reason: 'Perfecto para apartamentos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        user={userExample}
        currentView={currentView}
        onNavigate={(v) => setCurrentView(v)}
        onLogout={handleLogout}
      />
      <div className="pl-0 lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl text-gray-900 mb-2">
              ¡Hola, {userExample.name}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Te ayudamos a encontrar a tu compañero perfecto
            </p>
          </div>

          {/* Tarjetas superiores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6" onClick={onViewCatalog}>
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
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna central */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mis Solicitudes */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span>Mis Solicitudes de Adopción</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
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
                  )}
                </CardContent>
              </Card>

              {/* Visto Recientemente */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Visto Recientemente</span>
                    <Button variant="outline" size="sm" onClick={onViewCatalog}>
                      Ver todo
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentlyViewed.map((pet) => (
                      <div
                        key={pet.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <ImageWithFallback
                          src={pet.image}
                          alt={pet.name}
                          className="w-full h-40 rounded-lg object-cover mb-3"
                        />
                        <h4 className="text-lg text-gray-900 mb-1">{pet.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {pet.breed} • {pet.age} años
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="w-3 h-3 mr-1" />
                          {pet.location}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              {/* Recomendado para ti */}
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
              </Card>

              {/* Consejo del día */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
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
  );
}

export default AdopterDashboard;
