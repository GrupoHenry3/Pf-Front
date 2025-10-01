"use client";

import { useState } from "react";
import { Building2, Heart, PawPrint, Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { usePet } from "@/context/PetContext";
import { SheltersManagementView } from "@/components/admin/SheltersManagementView";
import { UsersManagementView } from "@/components/admin/UsersManagementView";
import { PetsManagementView } from "@/components/admin/PetsManagementView";
import { DonationsView } from "@/components/admin/DonationsView";
import { ApplicationsView } from "@/components/admin/ApplicationsView";
import { useAdoption } from "@/context/AdoptionContext";

export type AdminView =
  | "dashboard"
  | "shelters"
  | "pets"
  | "users"
  | "applications"
  | "donations";

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");

  const { user, isInitialized, isUserLoading, isProfileLoaded } = useUser();
  const { shelters } = useShelter();
  const { allPets } = usePet();
  const { allAdoptions } = useAdoption();

  const stats = [
    {
      title: "Adopciones",
      value: allAdoptions.length,
      icon: <Heart className="bg-green-200 rounded-full p-1 w-10 h-10"/>,
    },
    {
      title: "Mascotas",
      value: allPets.length,
      icon: <PawPrint className="bg-orange-200 rounded-full p-1 w-10 h-10"/>
    },
    { title: "Refugios", value: shelters.length, icon: <Building2 className="bg-blue-200 rounded-full p-1 w-10 h-10"/> },
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

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B"];

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
                  <Line
                    type="monotone"
                    dataKey="adopciones"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
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
                  {allAdoptions.length > 0 &&
                    allAdoptions.map((adoption) => (
                      <TableRow key={adoption.id}>
                        <TableCell>{adoption.pet.name}</TableCell>
                        <TableCell>
                          {/* <Badge variant="secondary">{adoption.type}</Badge> */}
                        </TableCell>
                        <TableCell>{adoption.user.fullName}</TableCell>
                        <TableCell>{adoption.createdAt}</TableCell>
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
}
