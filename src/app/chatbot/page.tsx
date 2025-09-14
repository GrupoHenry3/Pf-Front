"use client";

import { ChatBot } from "@/components/chatBot/ChatBot";
export default function HomePage() {
  const handleNavigation = (view: string) => {
    console.log("Navegar a:", view);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800">
        Bienvenido a PetAdopt 🐾
      </h1>

      {/* Chatbot flotante */}
      <ChatBot onNavigate={handleNavigation} />
    </main>
  );
}
