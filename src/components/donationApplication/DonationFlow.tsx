import { useState } from 'react';
import { ArrowLeft, Heart, CreditCard, Shield, Check, MapPin, Star, Building, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from '@/interfaces/User';
import { ImageWithFallback } from '../utils/ImageWithFallback';



interface DonationFlowProps {
  user: User | null;
  onBack: () => void;
  selectedShelterId?: string;
}

interface Shelter {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  totalAnimals: number;
  monthlyGoal: number;
  currentAmount: number;
  verified: boolean;
  urgentNeeds: string[];
}

interface DonationFormData {
  amount: string;
  frequency: 'once' | 'monthly';
  shelterId: string;
  purpose: string;
  message: string;
  anonymous: boolean;
  paymentMethod: 'card' | 'paypal';
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  cardName: string;
}

export function DonationFlow({ user, onBack, selectedShelterId }: DonationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [formData, setFormData] = useState<DonationFormData>({
    amount: '',
    frequency: 'once',
    shelterId: selectedShelterId || '',
    purpose: '',
    message: '',
    anonymous: false,
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    cardName: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationComplete, setDonationComplete] = useState(false);

  // Mock data - in real app this would come from an API
  const shelters: Shelter[] = [
    {
      id: '1',
      name: 'Refugio Esperanza Canina',
      location: 'Madrid, España',
      description: 'Dedicados al rescate y rehabilitación de perros abandonados desde 2010.',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
      rating: 4.8,
      totalAnimals: 45,
      monthlyGoal: 3500,
      currentAmount: 2100,
      verified: true,
      urgentNeeds: ['Medicamentos', 'Comida', 'Mantas']
    },
    {
      id: '2',
      name: 'Amigos Felinos Barcelona',
      location: 'Barcelona, España',
      description: 'Especialistas en el cuidado y adopción de gatos en situación vulnerable.',
      image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop',
      rating: 4.9,
      totalAnimals: 32,
      monthlyGoal: 2800,
      currentAmount: 1950,
      verified: true,
      urgentNeeds: ['Cirugías', 'Vacunas', 'Limpieza']
    },
    {
      id: '3',
      name: 'Patitas Solidarias Valencia',
      location: 'Valencia, España',
      description: 'Refugio mixto que acoge tanto perros como gatos rescatados.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
      rating: 4.7,
      totalAnimals: 38,
      monthlyGoal: 4000,
      currentAmount: 2650,
      verified: true,
      urgentNeeds: ['Construcción', 'Medicamentos', 'Juguetes']
    },
    {
      id: '4',
      name: 'Rescate Animal Sevilla',
      location: 'Sevilla, España',
      description: 'ONG enfocada en el rescate de emergencia y adopción responsable.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
      rating: 4.6,
      totalAnimals: 52,
      monthlyGoal: 3200,
      currentAmount: 1800,
      verified: true,
      urgentNeeds: ['Comida especial', 'Transporte', 'Veterinario']
    }
  ];

  const quickAmounts = [10, 25, 50, 100, 200];

  const handleShelterSelect = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setFormData(prev => ({ ...prev, shelterId: shelter.id }));
    setCurrentStep(2);
  };

  const handleAmountSelect = (amount: number) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const handleSubmitDonation = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setDonationComplete(true);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (donationComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-0 shadow-lg">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">¡Donación Exitosa!</h2>
              <p className="text-gray-600">Tu donación de €{formData.amount} ha sido procesada correctamente.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="text-gray-900 mb-2">Detalles de la donación:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Refugio:</span>
                  <span className="text-gray-900">{selectedShelter?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto:</span>
                  <span className="text-gray-900">€{formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frecuencia:</span>
                  <span className="text-gray-900">{formData.frequency === 'once' ? 'Una vez' : 'Mensual'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID Transacción:</span>
                  <span className="text-gray-900">TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => setCurrentStep(1)}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Hacer otra donación
              </Button>
              <Button 
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl text-gray-900">Hacer una Donación</h1>
              <p className="text-gray-600">Ayuda a los refugios de animales que más lo necesitan</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 ${
                    currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-20 text-sm text-gray-600">
              <span>Seleccionar refugio</span>
              <span>Configurar donación</span>
              <span>Procesar pago</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Shelter */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900">Selecciona un refugio para donar</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {shelters.map((shelter) => (
                <Card 
                  key={shelter.id} 
                  className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleShelterSelect(shelter)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <ImageWithFallback
                        src={shelter.image}
                        alt={shelter.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {shelter.verified && (
                        <Badge className="absolute top-3 right-3 bg-green-500">
                          <Shield className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg text-gray-900 mb-1">{shelter.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {shelter.location}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            {shelter.rating}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm">{shelter.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Meta mensual</span>
                          <span className="text-gray-900">€{shelter.currentAmount} / €{shelter.monthlyGoal}</span>
                        </div>
                        <Progress value={(shelter.currentAmount / shelter.monthlyGoal) * 100} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {shelter.totalAnimals} animales
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Necesidades urgentes:</p>
                        <div className="flex flex-wrap gap-1">
                          {shelter.urgentNeeds.map((need, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {need}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Configure Donation */}
        {currentStep === 2 && selectedShelter && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Configurar tu donación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Amount Selection */}
                  <div>
                    <Label className="text-base">Monto de la donación</Label>
                    <div className="grid grid-cols-5 gap-3 mt-3 mb-4">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={formData.amount === amount.toString() ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className={formData.amount === amount.toString() ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          €{amount}
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      placeholder="Monto personalizado"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <Label className="text-base">Frecuencia</Label>
                    <RadioGroup 
                      value={formData.frequency} 
                      onValueChange={(value: 'once' | 'monthly') => setFormData(prev => ({ ...prev, frequency: value }))}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="once" id="once" />
                        <Label htmlFor="once">Donación única</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Donación mensual recurrente</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Purpose */}
                  <div>
                    <Label htmlFor="purpose">Destino de la donación (opcional)</Label>
                    <Select value={formData.purpose} onValueChange={(value) => setFormData(prev => ({ ...prev, purpose: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Selecciona el uso de tu donación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Gastos generales del refugio</SelectItem>
                        <SelectItem value="medical">Gastos médicos y veterinarios</SelectItem>
                        <SelectItem value="food">Comida y suministros</SelectItem>
                        <SelectItem value="infrastructure">Mejoras en infraestructura</SelectItem>
                        <SelectItem value="rescue">Operaciones de rescate</SelectItem>
                        <SelectItem value="training">Entrenamiento y socialización</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <Label htmlFor="message">Mensaje para el refugio (opcional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Escribe un mensaje de apoyo para el refugio..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="mt-2"
                    />
                  </div>

                  {/* Anonymous */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="anonymous"
                      checked={formData.anonymous}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, anonymous: !!checked }))}
                    />
                    <Label htmlFor="anonymous">Donación anónima</Label>
                  </div>

                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cambiar refugio
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={!formData.amount || parseInt(formData.amount) < 5}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Continuar al pago
                </Button>
              </div>
            </div>

            {/* Sidebar - Selected Shelter Info */}
            <div>
              <Card className="border-0 shadow-md sticky top-8">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg text-gray-900">Tu donación</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Refugio:</span>
                      <span className="text-gray-900 text-right text-sm">{selectedShelter.name}</span>
                    </div>
                    
                    {formData.amount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monto:</span>
                        <span className="text-green-600">€{formData.amount}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frecuencia:</span>
                      <span className="text-gray-900">{formData.frequency === 'once' ? 'Una vez' : 'Mensual'}</span>
                    </div>

                    {formData.purpose && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destino:</span>
                        <span className="text-gray-900 text-right text-sm">
                          {formData.purpose === 'general' && 'Gastos generales'}
                          {formData.purpose === 'medical' && 'Gastos médicos'}
                          {formData.purpose === 'food' && 'Comida y suministros'}
                          {formData.purpose === 'infrastructure' && 'Infraestructura'}
                          {formData.purpose === 'rescue' && 'Operaciones de rescate'}
                          {formData.purpose === 'training' && 'Entrenamiento'}
                        </span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="text-center">
                    <ImageWithFallback
                      src={selectedShelter.image}
                      alt={selectedShelter.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="text-gray-900 mb-1">{selectedShelter.name}</h4>
                    <p className="text-sm text-gray-600">{selectedShelter.location}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Información de pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* Payment Method */}
                  <div>
                    <Label className="text-base">Método de pago</Label>
                    <RadioGroup 
                      value={formData.paymentMethod} 
                      onValueChange={(value: 'card' | 'paypal') => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                      className="mt-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Tarjeta de crédito/débito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal">PayPal</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                        <Input
                          id="cardName"
                          placeholder="Juan Pérez"
                          value={formData.cardName}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardNumber">Número de tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                          maxLength={19}
                          className="mt-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Fecha de vencimiento</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/AA"
                            value={formData.cardExpiry}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardExpiry: formatExpiry(e.target.value) }))}
                            maxLength={5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCVV">CVV</Label>
                          <Input
                            id="cardCVV"
                            placeholder="123"
                            value={formData.cardCVV}
                            onChange={(e) => setFormData(prev => ({ ...prev, cardCVV: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'paypal' && (
                    <Alert>
                      <AlertDescription>
                        Serás redirigido a PayPal para completar tu donación de forma segura.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-900">
                          Tu información de pago está protegida con encriptación SSL de 256 bits. 
                          Nunca almacenamos información de tarjetas de crédito.
                        </p>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Modificar donación
                </Button>
                <Button 
                  onClick={handleSubmitDonation}
                  disabled={isProcessing || !formData.amount || 
                    (formData.paymentMethod === 'card' && (!formData.cardName || !formData.cardNumber || !formData.cardExpiry || !formData.cardCVV))}
                  className="bg-green-500 hover:bg-green-600"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </div>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Donar €{formData.amount}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Payment Summary */}
            <div>
              <Card className="border-0 shadow-md sticky top-8">
                <CardHeader>
                  <CardTitle>Resumen de donación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Donación:</span>
                      <span className="text-gray-900">€{formData.amount}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Comisión de procesamiento:</span>
                      <span className="text-gray-900">€0.00</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-green-600">€{formData.amount}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✨ El 100% de tu donación va directamente al refugio. 
                      No cobramos comisiones en las donaciones.
                    </p>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-xs text-gray-500">
                      Al completar esta donación, aceptas nuestros términos y condiciones 
                      y política de privacidad.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}