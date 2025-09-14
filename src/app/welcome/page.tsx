"use client";

import { Welcome } from "@/components/hero/Hero";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Ejemplo: redirigir a página de adopción
    router.push("/adopcion");
  };

  const handleViewCatalog = () => {
    // Ejemplo: redirigir al catálogo de mascotas
    router.push("/catalogo");
  };

  return (
    <main>
      <Welcome
        onGetStarted={handleGetStarted}
        onViewCatalog={handleViewCatalog}
      />
    </main>
  );
}
