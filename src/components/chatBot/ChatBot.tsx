"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Heart, Search, Plus, DollarSign } from 'lucide-react';

interface ChatbotProps {
  onNavigate: (page: string, data?: any) => void;
  userType?: 'adopter' | 'donor' | 'admin' | null;
}

export function ChatBot({ onNavigate, userType }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '¡Hola! Soy AdoptaBot, tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentFlow, setCurrentFlow] = useState<'initial' | 'adopt' | 'donate' | 'publish' | 'help'>('initial');

  const quickActions = [
    { id: 'adopt', text: '🐕 Quiero adoptar', icon: Heart },
    { id: 'publish', text: '📝 Publicar mascota', icon: Plus },
    { id: 'donate', text: '💝 Hacer donación', icon: DollarSign },
    { id: 'search', text: '🔍 Buscar mascotas', icon: Search }
  ];

  const adoptionQuestions = [
    {
      id: 'pet_type',
      question: '¿Qué tipo de mascota buscas?',
      options: ['Perro', 'Gato', 'Ambos', 'Otros']
    },
    {
      id: 'location',
      question: '¿En qué ciudad te encuentras?',
      options: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Otra']
    },
    {
      id: 'experience',
      question: '¿Tienes experiencia cuidando mascotas?',
      options: ['Mucha experiencia', 'Algo de experiencia', 'Soy principiante']
    }
  ];

  const publishQuestions = [
    {
      id: 'pet_info',
      question: '¿Qué información tienes de la mascota?',
      options: ['Tengo fotos y datos completos', 'Solo tengo información básica', 'Necesito ayuda recopilando datos']
    },
    {
      id: 'reason',
      question: '¿Por qué necesitas encontrarle un hogar?',
      options: ['No puedo cuidarla más', 'La encontré en la calle', 'Soy un refugio']
    }
  ];

  const addBotMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickAction = (actionId: string) => {
    addUserMessage(quickActions.find(a => a.id === actionId)?.text || actionId);
    
    switch (actionId) {
      case 'adopt':
        setCurrentFlow('adopt');
        addBotMessage('¡Perfecto! Te ayudo a encontrar tu compañero ideal. Permíteme hacerte algunas preguntas:');
        setTimeout(() => {
          addBotMessage(adoptionQuestions[0].question);
        }, 1000);
        break;
      case 'publish':
        setCurrentFlow('publish');
        addBotMessage('Te ayudo a publicar una mascota para adopción. Vamos paso a paso:');
        setTimeout(() => {
          addBotMessage(publishQuestions[0].question);
        }, 1000);
        break;
      case 'donate':
        addBotMessage('¡Qué generoso! Las donaciones ayudan muchísimo a los refugios. Te redirijo a la sección de donaciones.');
        setTimeout(() => {
          onNavigate('donations');
          setIsOpen(false);
        }, 2000);
        break;
      case 'search':
        addBotMessage('Te llevo directamente al catálogo de mascotas disponibles.');
        setTimeout(() => {
          onNavigate('catalog');
          setIsOpen(false);
        }, 1500);
        break;
    }
  };

  const handleOptionSelect = (option: string) => {
    addUserMessage(option);
    
    if (currentFlow === 'adopt') {
      addBotMessage(`Perfecto, has elegido: ${option}. Esto me ayuda a recomendarte las mejores opciones.`);
      setTimeout(() => {
        addBotMessage('¿Te gustaría que te lleve directamente al catálogo con filtros aplicados?');
      }, 1500);
    } else if (currentFlow === 'publish') {
      addBotMessage(`Entendido: ${option}. Te guiaré en el proceso de publicación.`);
      setTimeout(() => {
        if (!userType) {
          addBotMessage('Primero necesitas crear una cuenta. ¿Te ayudo con el registro?');
        } else {
          addBotMessage('Te redirijo al formulario de publicación.');
          onNavigate('addPet');
          setIsOpen(false);
        }
      }, 1500);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      addUserMessage(inputMessage);
      const userMsg = inputMessage.toLowerCase();
      setInputMessage('');
      
      // Simple response logic
      setTimeout(() => {
        if (userMsg.includes('hola') || userMsg.includes('ayuda')) {
          addBotMessage('¡Hola! ¿En qué puedo ayudarte? Puedo ayudarte a adoptar, publicar una mascota, hacer donaciones o buscar información.');
        } else if (userMsg.includes('adoptar') || userMsg.includes('mascota')) {
          addBotMessage('¿Te interesa adoptar una mascota? ¡Excelente! Te puedo ayudar a encontrar el compañero perfecto.');
        } else if (userMsg.includes('donar') || userMsg.includes('donación')) {
          addBotMessage('Las donaciones son muy importantes para ayudar a los refugios. ¿Te gustaría hacer una donación?');
        } else if (userMsg.includes('publicar')) {
          addBotMessage('¿Quieres publicar una mascota para adopción? Te ayudo con todo el proceso.');
        } else {
          addBotMessage('Entiendo. ¿Hay algo específico en lo que pueda ayudarte? Puedo asistirte con adopciones, publicaciones o donaciones.');
        }
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            style={{ backgroundColor: '#FF9800' }}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
          <Card className="h-full flex flex-col shadow-xl">
            {/* Header */}
            <CardHeader className="pb-2" style={{ backgroundColor: '#4CAF50' }}>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs" style={{ backgroundColor: '#FF9800' }}>
                      🤖
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm">AdoptaBot</CardTitle>
                    <p className="text-xs opacity-90">Asistente Virtual</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 opacity-70`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">Selecciona una opción:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.id)}
                        className="text-xs p-2 h-auto"
                      >
                        <action.icon className="h-3 w-3 mr-1" />
                        {action.text.replace(/[🐕📝💝🔍]/g, '')}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Context-specific options */}
              {currentFlow === 'adopt' && (
                <div className="space-y-2">
                  {adoptionQuestions[0] && (
                    <div className="grid grid-cols-2 gap-1">
                      {adoptionQuestions[0].options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptionSelect(option)}
                          className="text-xs p-1 h-auto"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentFlow === 'publish' && (
                <div className="space-y-2">
                  {publishQuestions[0] && (
                    <div className="space-y-1">
                      {publishQuestions[0].options.map((option) => (
                        <Button
                          key={option}
                          variant="outline"
                          size="sm"
                          onClick={() => handleOptionSelect(option)}
                          className="text-xs p-1 h-auto w-full text-left justify-start"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  style={{ backgroundColor: '#4CAF50' }}
                  disabled={!inputMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}