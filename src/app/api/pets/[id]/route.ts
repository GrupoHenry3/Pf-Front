import { NextResponse } from "next/server";
import type { Pet } from "@/interfaces/Pet";

// Simulación de base de datos
const pets: Pet[] = [
  {
    id: "1",
    dni: "123456",
    name: "Firulais",
    type: "dog",
    breed: "Labrador",
    age: 3,
    size: "medium",
    gender: "male",
    description: "Un perro muy amigable",
    images: ["https://example.com/foto1.jpg"],
    location: "Piedecuesta",
    shelterId: "shelter1",
    shelterName: "Refugio Animal",
    vaccinated: true,
    neutered: true,
    trained: false,
    goodWithKids: true,
    goodWithPets: true,
    status: "available",
    dateAdded: "2025-09-01T12:00:00Z"
  }
];

// Función GET para la ruta dinámica
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pet = pets.find(p => p.id === id);

  if (!pet) {
    return NextResponse.json({ message: "Mascota no encontrada" }, { status: 404 });
  }

  return NextResponse.json(pet);
}
