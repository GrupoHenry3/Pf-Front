"use client";

import { AddPet } from "@/components/AddPet/AddPet";
import type { User } from "@/interfaces/User";

export default function AddPetPage() {
  const user: User = {
    id: "1",
    name: "Lucas",
    location: "Buenos Aires, Argentina"
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSuccess = () => {
    alert("¡Mascota agregada con éxito!");
  };

  return (
    <div>
      <AddPet user={user} onBack={handleBack} onSuccess={handleSuccess} />
    </div>
  );
}
