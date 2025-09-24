"use client";

import { AddPet } from "@/components/addPet/addPet";
import { useUser } from "@/context/UserContext"; // ajusta la ruta según tu proyecto

export default function AddPetPage() {
  const { user, isInitialized, isUserLoading } = useUser();

  const handleBack = () => {
    window.history.back();
  };

  const handleSuccess = () => {
    alert("¡Mascota agregada con éxito!");
  };

  // Si todavía estamos cargando el usuario o inicializando el contexto
  if (!isInitialized || isUserLoading) return <p>Cargando usuario...</p>;

  // Si no hay usuario logueado, podemos mostrar un mensaje o redirigir
  if (!user) return <p>No hay usuario logueado.</p>;

  return (
    <div>
      <AddPet onBack={handleBack} onSuccess={handleSuccess} />
    </div>
  );
}