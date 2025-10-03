"use client";
import {
  Heart,
  Search,
  Users,
  Shield,
  MessageCircle,
  ArrowRight,
} from "lucide-react";


import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeProps {
  onGetStarted: () => void;
  onViewCatalog: () => void;
}
 function welcome({}: WelcomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50"><section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  PetAdopt
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-gray-900 leading-tight">
                Encuentra tu
                <span className="text-green-500 block">compañero perfecto</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Conectamos familias amorosas con mascotas que necesitan un
                hogar. Miles de perros y gatos esperan conocerte.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl flex items-center"
                >
                  <Link href="/auth" className="flex items-center">
                    Comenzar Adopción
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                <Button
                  asChild 
                  variant="outline"
                  size="lg"
                  className="border-2 border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl"
                >
                  <Link href="dashboard/pet-catalog">
                    Ver Mascotas Disponibles
                  </Link>
                </Button>
              </div>
            </div><div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop&crop=faces"
                  alt="Familia feliz con mascota adoptada"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-orange-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section><section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
              ¿Por qué elegir PetAdopt?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Facilitamos el proceso de adopción con herramientas diseñadas para
              conectar de manera segura a adoptantes y refugios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Search,
                title: "Búsqueda Inteligente",
                description:
                  "Encuentra mascotas por raza, edad, tamaño y personalidad",
              },
              {
                icon: Shield,
                title: "Proceso Seguro",
                description:
                  "Verificación de refugios y proceso de adopción transparente",
              },
              {
                icon: MessageCircle,
                title: "Chat Directo",
                description:
                  "Comunícate directamente con refugios y otros adoptantes",
              },
              {
                icon: Users,
                title: "Comunidad",
                description: "Únete a una comunidad de amantes de los animales",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section><section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                number: "12,847",
                label: "Mascotas Adoptadas",
                color: "text-green-600",
              },
              {
                number: "1,250",
                label: "Refugios Registrados",
                color: "text-orange-600",
              },
              {
                number: "8,934",
                label: "Familias Felices",
                color: "text-green-600",
              },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className={`text-4xl sm:text-5xl ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-xl text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section><section className="py-20 bg-gradient-to-r from-green-500 to-green-600">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl mb-6 text-white">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de personas que han encontrado a su compañero
            perfecto. El proceso es simple, seguro y completamente gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-xl shadow-lg"
            >
              <Link href="/pet-catalog">
                Quiero Adoptar
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="ghost"
              className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-medium transition-all duration-200"
            >
              <Link href="/auth">
                Registrar Refugio
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default welcome;
