"use client"
import { Button } from "@/app/ui/Button";
import { Heart, ArrowRight } from "lucide-react";

export const Hero = () => {

  const onGetStarted = () => {
    alert("button clicked")
  }

  const onViewCatalog = () => {
    alert("button clicked")
  }

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">PetAdopt</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-foreground leading-tight">
              Encuentra tu
              <span className="text-primary block">compañero perfecto</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Conectamos familias amorosas con mascotas que necesitan un hogar.
              Miles de perros, gatos y otras mascotas esperan conocerte.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                Comenzar Adopción
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={onViewCatalog}
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary px-8 py-4 rounded-xl"
              >
                Ver Mascotas Disponibles
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=600&fit=crop&crop=faces"
                alt="Hero"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-accent rounded-full opacity-20"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
