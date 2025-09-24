"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { useShelter } from "@/context/ShelterContext";

export type AdminView = 
  | "dashboard" 
  | "shelters" 
  | "pets" 
  | "users" 
  | "applications" 
  | "donations" 
  | "analytics" 
  | "reports" 
  | "moderation" 
  | "logs";

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  const {user, isInitialized, isUserLoading, isProfileLoaded} = useUser();
  const {shelters} = useShelter();

  const stats = [
    { title: "Adopciones", value: "256", change: "+12%" },
    { title: "Usuarios activos", value: "1,245", change: "+8%" },
    { title: "Mascotas disponibles", value: "78", change: "-5%" },
    { title: "Donaciones", value: "$4,250", change: "+15%" },
  ];


  const adoptionData = [
    { month: "Ene", adopciones: 45 },
    { month: "Feb", adopciones: 52 },
    { month: "Mar", adopciones: 38 },
    { month: "Abr", adopciones: 61 },
    { month: "May", adopciones: 72 },
    { month: "Jun", adopciones: 49 },
  ];

  const animalTypes = [
    { name: "Perros", value: 45 },
    { name: "Gatos", value: 30 },
    { name: "Otros", value: 25 },
  ];

  const recentAdoptions = [
    { id: 1, pet: "Luna", type: "Perro", user: "María González", date: "12/06/2024" },
    { id: 2, pet: "Michi", type: "Gato", user: "Carlos Pérez", date: "11/06/2024" },
    { id: 3, pet: "Max", type: "Perro", user: "Laura Torres", date: "10/06/2024" },
    { id: 4, pet: "Nina", type: "Conejo", user: "Ana Martínez", date: "09/06/2024" },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

  const getViewTitle = (view: AdminView): string => {
    const titles = {
      dashboard: "Panel de Administración",
      shelters: "Gestión de Refugios",
      pets: "Gestión de Mascotas",
      users: "Gestión de Usuarios",
      applications: "Solicitudes de Adopción",
      donations: "Donaciones del Sistema",
      analytics: "Analíticas",
      reports: "Reportes",
      moderation: "Moderación",
      logs: "Logs del Sistema"
    };
    return titles[view];
  };

  const getViewDescription = (view: AdminView): string => {
    const descriptions = {
      dashboard: "Resumen general y estadísticas del sistema",
      shelters: "Administra y supervisa todos los refugios registrados",
      pets: "Gestiona todas las mascotas del sistema",
      users: "Administra usuarios, roles y permisos",
      applications: "Revisa y gestiona solicitudes de adopción",
      donations: "Monitorea donaciones y transacciones",
      analytics: "Estadísticas detalladas y métricas",
      reports: "Genera reportes del sistema",
      moderation: "Herramientas de moderación y control",
      logs: "Registros y actividad del sistema"
    };
    return descriptions[view];
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <>
            <Alert className="mb-8 border-l-4 border-green-500 bg-green-50">
              <AlertDescription>
                🎉 ¡Has alcanzado un nuevo récord de adopciones este mes!
              </AlertDescription>
            </Alert>

            <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
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

              <TabsContent value="overview" className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Adopciones por mes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={adoptionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="adopciones" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución de mascotas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={animalTypes} dataKey="value" label>
                          {animalTypes.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendencia de adopciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={adoptionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="adopciones" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
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
                        {recentAdoptions.map((adoption) => (
                          <TableRow key={adoption.id}>
                            <TableCell>{adoption.pet}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{adoption.type}</Badge>
                            </TableCell>
                            <TableCell>{adoption.user}</TableCell>
                            <TableCell>{adoption.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        );

      case "shelters":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Refugios</CardTitle>
            </CardHeader>
            <CardContent>
              {shelters?.map((shelter) => (
                <div key={shelter.id}>
                  <h3>{shelter.name}</h3>
                  <p>{shelter.address}</p>
                  <p>{shelter.phoneNumber}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        );

      case "pets":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Mascotas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Aquí se mostrará la lista de todas las mascotas del sistema.</p>
              </CardContent>
          </Card>
        );

      case "users":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Aquí se mostrará la lista de todos los usuarios registrados.</p>
            </CardContent>
          </Card>
        );

      case "applications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes de Adopción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Aquí se mostrarán todas las solicitudes de adopción pendientes.</p>
            </CardContent>
          </Card>
        );

      case "donations":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Donaciones del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Aquí se mostrarán todas las donaciones realizadas.</p>
            </CardContent>
          </Card>
        );

      case "reports":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reportes del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Aquí se podrán generar y descargar reportes.</p>
            </CardContent>
          </Card>
        );

      default:
        return <div>Vista no encontrada</div>;
    }
  };


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
  
  if (!user) {
    return null;
  }
  
  if (!user.siteAdmin) {
    alert('No tienes permiso para acceder a esta página');
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar user={user} onViewChange={(view: AdminView) => setCurrentView(view)} />

      <div className="flex-1 lg:ml-64 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-gray-900">{getViewTitle(currentView)}</h1>
              <p className="text-gray-600">{getViewDescription(currentView)}</p>
            </div>
            <div className="flex items-center space-x-4">
              {currentView === "dashboard" && (
                <>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 días</SelectItem>
                      <SelectItem value="30">30 días</SelectItem>
                      <SelectItem value="90">90 días</SelectItem>
                      <SelectItem value="365">1 año</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-green-500 hover:bg-green-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Button>
                </>
              )}
            </div>
          </div>

          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
}

