"use client";
import { Building2, Heart, PawPrint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { useShelter } from "@/context/ShelterContext";
import { usePet } from "@/context/PetContext";

import { useAdoption } from "@/context/AdoptionContext";

export type AdminView =
  | "dashboard"
  | "shelters"
  | "pets"
  | "users"
  | "applications"
  | "donations";

export default function AdminDashboard() {

  const { user, isInitialized, isUserLoading, isProfileLoaded } = useUser();
  const { shelters } = useShelter();
  const { allPets } = usePet();
  const { allAdoptions } = useAdoption();
  

  const stats = [
    {
      title: "Adopciones",
      value: allAdoptions.length ,
      icon: <Heart className="bg-green-200 rounded-full p-1 w-10 h-10"/>,
    },
    {
      title: "Mascotas",
      value: allPets.length,
      icon: <PawPrint className="bg-orange-200 rounded-full p-1 w-10 h-10"/>
    },
    { title: "Refugios", value: shelters.length, icon: <Building2 className="bg-blue-200 rounded-full p-1 w-10 h-10"/> },
  ];



  if (!isInitialized || isUserLoading || !isProfileLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">
            {!isInitialized && "Inicializando..."}
            {isInitialized && isUserLoading && "Cargando perfil..."}
            {isInitialized &&
              !isUserLoading &&
              !isProfileLoaded &&
              "Verificando autenticación..."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
        <div className="mb-8 py-6">
            <h1 className="text-3xl text-gray-900 mb-2">
              ¡Hola, {user!.fullName || 'Administrador'}! 👋
            </h1>
            <p className="text-lg text-gray-600">
                Aqui puedes gestionar la información de la plataforma
            </p>{user!.email && (
              <p className="text-sm text-gray-500 mt-1">
                Conectado como: {user!.email}
              </p>
            )}
          </div>
      <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex items-center ">
              {stat.icon}
              <CardTitle className="ml-2 text-xl">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold ">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de refugios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-700">Verificados</span>
                    <span className="text-2xl font-bold text-green-600">
                      {shelters.filter(s => s.isVerified).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium text-yellow-700">Pendientes</span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {shelters.filter(s => !s.isVerified).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-700">Activos</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {shelters.filter(s => s.isActive).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de mascotas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-700">Total</span>
                    <span className="text-2xl font-bold text-green-600">{allPets.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-700">Adoptadas</span>
                    <span className="text-2xl font-bold text-blue-600">{allAdoptions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium text-orange-700">Disponibles</span>
                    <span className="text-2xl font-bold text-orange-600">{allPets.length - allAdoptions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de adopciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-700">Total</span>
                    <span className="text-2xl font-bold text-green-600">{allAdoptions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-700">Esta semana</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {allAdoptions.filter(adoption => {
                        const adoptionDate = new Date(adoption.createdAt);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return adoptionDate > weekAgo;
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-purple-700">Este mes</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {allAdoptions.filter(adoption => {
                        const adoptionDate = new Date(adoption.createdAt);
                        const monthAgo = new Date();
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return adoptionDate > monthAgo;
                      }).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de mascotas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total de mascotas</span>
                    <span className="text-2xl font-bold text-green-600">{allPets.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mascotas adoptadas</span>
                    <span className="text-2xl font-bold text-blue-600">{allAdoptions.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Mascotas disponibles</span>
                    <span className="text-2xl font-bold text-orange-600">{allPets.length - allAdoptions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actividad reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 border-l-4 border-green-500 bg-green-50">
                    <div>
                      <div className="font-medium text-green-800">Nuevas adopciones</div>
                      <div className="text-sm text-green-600">
                        {allAdoptions.filter(adoption => {
                          const adoptionDate = new Date(adoption.createdAt);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return adoptionDate > weekAgo;
                        }).length} esta semana
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 border-l-4 border-blue-500 bg-blue-50">
                    <div>
                      <div className="font-medium text-blue-800">Refugios registrados</div>
                      <div className="text-sm text-blue-600">
                        {shelters.filter(shelter => {
                          const shelterDate = new Date(shelter.createdAt || new Date());
                          const monthAgo = new Date();
                          monthAgo.setMonth(monthAgo.getMonth() - 1);
                          return shelterDate > monthAgo;
                        }).length} este mes
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Últimas adopciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mascota</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAdoptions.length > 0 ? (
                    allAdoptions.slice(-10).map((adoption) => (
                      <TableRow key={adoption.id}>
                        <TableCell className="font-medium">{adoption.pet?.name || 'Sin nombre'}</TableCell>
                        <TableCell>{adoption.pet?.species?.name || 'Sin especificar'}</TableCell>
                        <TableCell>{adoption.user?.fullName || 'Usuario no encontrado'}</TableCell>
                        <TableCell>
                          {new Date(adoption.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No hay adopciones registradas
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
