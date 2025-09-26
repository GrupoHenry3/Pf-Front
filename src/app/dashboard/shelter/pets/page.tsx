"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/utils/ImageWithFallback";
import { usePet } from "@/context/PetContext";
import { Edit } from "lucide-react";

const PetsPage = () => {
  const { pets, isPetLoading } = usePet();

	if (isPetLoading) {
		return(
			<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus mascotas...</p>
        </div>
      </div>
		)
	}

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader>
        <CardTitle>Lista de Refugios</CardTitle>
      </CardHeader>
      <CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {pets?.map((pet) => (
          <div
					key={pet.id}
					className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
				>
					<div className="relative mb-3">
						<ImageWithFallback
							src={pet.breed.avatarURL || "/placeholder-pet.jpg"}
							alt={pet.name}
							className="w-full h-40 rounded-lg object-cover"
						/>
						<Button
							size="sm"
							variant="secondary"
							className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white"
						>
							<Edit className="w-4 h-4" />
						</Button>
					</div>

					<div className="flex items-center justify-between mb-2">
						<h4 className="text-lg text-gray-900">{pet.name}</h4>
						<span className={`px-2 py-1 rounded-full text-xs ${
							pet.isAdopted 
								? "bg-green-100 text-green-800" 
								: "bg-blue-100 text-blue-800"
						}`}>
							{pet.isAdopted ? "Adoptado" : "Disponible"}
						</span>
					</div>

					<p className="text-sm text-gray-600 mb-3">
						{pet.breed.name} • {pet.age} años • {pet.size}
					</p>

					<div className="flex items-center justify-between text-sm">
						<span className="text-gray-500">
							{pet.species.name}
						</span>
						<span className="text-gray-500">
							Agregado el{" "}
							{new Date(pet.createdAt).toLocaleDateString()}
						</span>
					</div>
				</div>
        ))}
				</div>
      </CardContent>
    </Card>
				
  );
};

export default PetsPage;
