"use client";
import { useState } from 'react';
import { ArrowLeft, Heart, CreditCard, TrendingUp, Calendar, Download, Gift, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge'; 
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User } from '@/interfaces/User';


interface DonationsProps {
  user: User;
  onBack: () => void;
}

export function Donations({ user, onBack }: DonationsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    targetAmount: '',
    endDate: '',
    category: ''
  });

  // Mock data - in real app this would come from an API
  const donationStats = {
    totalReceived: 15420,
    monthlyGoal: 20000,
    totalDonors: 387,
    averageDonation: 39.8,
    campaignsActive: 3
  };

  const donationHistory = [
    { month: 'Ene', cantidad: 1200 },
    { month: 'Feb', cantidad: 1580 },
    { month: 'Mar', cantidad: 2100 },
    { month: 'Abr', cantidad: 2650 },
    { month: 'May', cantidad: 3200 },
    { month: 'Jun', cantidad: 4690 }
  ];

  const activeCampaigns = [
    {
      id: '1',
      title: 'Cirugía de emergencia para Rex',
      description: 'Rex necesita una cirugía urgente para salvar su vida.',
      currentAmount: 850,
      targetAmount: 1200,
      endDate: '2024-04-15',
      donors: 23,
      category: 'Medicina'
    },
    {
      id: '2',
      title: 'Construcción nuevo refugio',
      description: 'Ayúdanos a construir un refugio más grande para más mascotas.',
      currentAmount: 5200,
      targetAmount: 15000,
      endDate: '2024-05-30',
      donors: 87,
      category: 'Infraestructura'
    },
    {
      id: '3',
      title: 'Vacunas para gatitos rescatados',
      description: 'Necesitamos fondos para vacunar a 20 gatitos recién rescatados.',
      currentAmount: 320,
      targetAmount: 600,
      endDate: '2024-04-01',
      donors: 12,
      category: 'Medicina'
    }
  ];

  const recentDonations = [
    { donor: 'María González', amount: 50, date: '2024-03-18', campaign: 'Cirugía de Rex' },
    { donor: 'Carlos Ruiz', amount: 25, date: '2024-03-17', campaign: 'Nuevo refugio' },
    { donor: 'Ana López', amount: 75, date: '2024-03-16', campaign: 'Vacunas gatitos' },
    { donor: 'Pedro Martín', amount: 30, date: '2024-03-15', campaign: 'Cirugía de Rex' },
    { donor: 'Donante Anónimo', amount: 100, date: '2024-03-14', campaign: 'Nuevo refugio' }
  ];

  const handleCreateCampaign = () => {
    // In real app, this would create a new campaign via API
    console.log('Creating campaign:', newCampaign);
    setShowCreateCampaign(false);
    setNewCampaign({
      title: '',
      description: '',
      targetAmount: '',
      endDate: '',
      category: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl text-gray-900">Centro de Donaciones</h1>
              <p className="text-gray-600">Gestiona campañas y recibe donaciones</p>
            </div>
          </div>
          
          <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Gift className="w-4 h-4 mr-2" />
                Nueva Campaña
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nueva Campaña</DialogTitle>
                <DialogDescription>
                  Completa la información para crear una nueva campaña de donaciones para tu refugio.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="title">Título de la campaña</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Ayuda médica para Luna"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign(prev => ({...prev, title: e.target.value}))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Explica por qué necesitas donaciones y cómo se usarán..."
                    value={newCampaign.description}
                    onChange={(e) => setNewCampaign(prev => ({...prev, description: e.target.value}))}
                    className="mt-2 min-h-24"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetAmount">Meta de recaudación (€)</Label>
                    <Input
                      id="targetAmount"
                      type="number"
                      placeholder="1000"
                      value={newCampaign.targetAmount}
                      onChange={(e) => setNewCampaign(prev => ({...prev, targetAmount: e.target.value}))}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">Fecha límite</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newCampaign.endDate}
                      onChange={(e) => setNewCampaign(prev => ({...prev, endDate: e.target.value}))}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Select value={newCampaign.category} onValueChange={(value) => setNewCampaign(prev => ({...prev, category: value}))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medicina">Medicina</SelectItem>
                      <SelectItem value="infraestructura">Infraestructura</SelectItem>
                      <SelectItem value="alimentacion">Alimentación</SelectItem>
                      <SelectItem value="rescate">Rescate</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateCampaign} className="bg-green-500 hover:bg-green-600">
                    Crear Campaña
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Recaudado</p>
                  <p className="text-2xl text-gray-900">€{donationStats.totalReceived.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meta Mensual</p>
                  <p className="text-2xl text-gray-900">€{donationStats.monthlyGoal.toLocaleString()}</p>
                  <Progress value={(donationStats.totalReceived / donationStats.monthlyGoal) * 100} className="h-1 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Donantes</p>
                  <p className="text-2xl text-gray-900">{donationStats.totalDonors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Donación Promedio</p>
                  <p className="text-2xl text-gray-900">€{donationStats.averageDonation}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Campañas Activas</p>
                  <p className="text-2xl text-gray-900">{donationStats.campaignsActive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="campaigns">Campañas</TabsTrigger>
            <TabsTrigger value="donors">Donantes</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Recaudación Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={donationHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`€${value}`, 'Cantidad']} />
                      <Line type="monotone" dataKey="cantidad" stroke="#4CAF50" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Donaciones Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDonations.slice(0, 5).map((donation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-gray-900">{donation.donor}</p>
                          <p className="text-sm text-gray-500">{donation.campaign}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600">€{donation.amount}</p>
                          <p className="text-xs text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeCampaigns.map((campaign) => (
                <Card key={campaign.id} className="border-0 shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <Badge variant="outline">{campaign.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{campaign.description}</p>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progreso</span>
                        <span>€{campaign.currentAmount} / €{campaign.targetAmount}</span>
                      </div>
                      <Progress value={(campaign.currentAmount / campaign.targetAmount) * 100} className="h-2" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{campaign.donors} donantes</span>
                      <span>Hasta {new Date(campaign.endDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Editar
                      </Button>
                      <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                        Ver detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Donors Tab */}
          <TabsContent value="donors" className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Lista de Donantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentDonations.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                          {donation.donor.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-900">{donation.donor}</p>
                          <p className="text-sm text-gray-500">Donó a: {donation.campaign}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-green-600">€{donation.amount}</p>
                        <p className="text-xs text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Reporte Financiero</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ingresos totales:</span>
                    <span className="text-gray-900">€{donationStats.totalReceived.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número de transacciones:</span>
                    <span className="text-gray-900">147</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comisiones de plataforma:</span>
                    <span className="text-gray-900">€{(donationStats.totalReceived * 0.03).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-900">Neto recibido:</span>
                    <span className="text-green-600">€{(donationStats.totalReceived * 0.97).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Análisis de Donantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donantes únicos:</span>
                    <span className="text-gray-900">{donationStats.totalDonors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donantes recurrentes:</span>
                    <span className="text-gray-900">78 (20%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Donación promedio:</span>
                    <span className="text-gray-900">€{donationStats.averageDonation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tasa de conversión:</span>
                    <span className="text-gray-900">3.2%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}